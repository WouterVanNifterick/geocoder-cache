import {CreateTableCommand, DescribeTableCommand, DynamoDB} from "@aws-sdk/client-dynamodb";
import {GeoDataManagerConfiguration, GeoDataManager, GeoTableUtil} from "dynamodb-geo-v3";
import {GeoLocation} from "./Location.ts";
import {GeoLocationCache, ReverseGeoCoder} from "../interfaces/geocoder.ts";

/*
    This is a DynamoDb cache for GeoLocations.
    It stores the locations in a DynamoDb table.
    It uses the dynamodb-geo library to store the locations as geo-hashes.
*/

export class DynamoDbGeoCoder implements ReverseGeoCoder, GeoLocationCache {
    geoDataManager: GeoDataManager;
    _tableExists: boolean = false;
    constructor(
        private ddb:DynamoDB = new DynamoDB({ region: "eu-west-1" }),
        private tableName: string = "locations",
    ) {
        const config = new GeoDataManagerConfiguration(this.ddb, this.tableName);
        config.hashKeyLength = 5;
        this.geoDataManager = new GeoDataManager(config);
        (async () => {
            await this.createTable();
        })();
    }

    async tableExists(): Promise<boolean> {
        if(this._tableExists) {
            // if we've seen it once,
            // let's just assume it still exists
            // without checking again
            return true;
        }

        const command = new DescribeTableCommand({
            TableName: this.geoDataManager.getGeoDataManagerConfiguration().tableName,
        });
        const response = await this.ddb.send(command);
        this._tableExists = (response?.Table?.TableName!==undefined);
        return this._tableExists;
    }

    async createTable() {
        if(await this.tableExists()) {
            return;
        }

        const createTableInput = GeoTableUtil.getCreateTableRequest(this.geoDataManager.getGeoDataManagerConfiguration());
        if (!createTableInput.ProvisionedThroughput) {
            createTableInput.ProvisionedThroughput = {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            };
        }
        console.dir(createTableInput, {depth: null});
        const command = new CreateTableCommand(createTableInput);
        const response = await this.ddb.send(command);
        console.log(response);
        return response;
    }

    async getAll(lat: number, lng: number, radiusM: number): Promise<GeoLocation[]> {
        if(!this._tableExists) {
            throw new Error("Table does not exist");
        }

        const res = await this.geoDataManager
            .queryRadius({
                RadiusInMeter: radiusM,
                CenterPoint: {
                    latitude: lat,
                    longitude: lng,
                },
            });
        const geoLocations: GeoLocation[] = res.map((l) => {
            console.log({l});
            const loc = {
                source: l.source?.S ?? "DynamoDb",
                provider: l.provider?.S ?? "DynamoDb",
                cached: l.cached?.S ?? new Date().toISOString(),
                address: l.address?.S ?? "{}",
            }
            const geoLoc = new GeoLocation(lat, lng);
            geoLoc.source = "DynamoDb";
            geoLoc.provider = loc.provider;
            geoLoc.cached = new Date(loc.cached);
            geoLoc.address = JSON.parse(loc.address);
            geoLoc.distanceM = geoLoc.getDistanceMLatLng(lat, lng);
            return geoLoc;
        });

        console.log("getLocationsInRadius", geoLocations);
        return geoLocations;
    }


    async addLocation(loc: GeoLocation) {
        if(!this._tableExists) {
            throw new Error("Table does not exist");
        }

        try {
            await this.geoDataManager
                .putPoint({
                    RangeKeyValue: {S: loc.coordinateId}, // Use this to ensure uniqueness of the hash/range pairs.
                    GeoPoint: {
                        // An object specifying latitude and longitude as plain numbers. Used to build the geo-hash, the hash-key and geo-json data
                        latitude: loc.lat,
                        longitude: loc.lng
                    },
                    PutItemInput: {
                        // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
                        Item: {
                            // The primary key, geo-hash and geo-json data is filled in for you
                            source: {S: loc.source}, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                            provider: {S: loc.provider},
                            cached: {S: loc.cached.toISOString()},
                            address: {S: JSON.stringify(loc.address)},
                        },
                        // ... Anything else to pass through to `putItem`, e.g. ConditionExpression
                    },
                })
                .then(() => {
                    console.log("Done!");
                });

            console.log("addLocation", loc);
        } catch (e) {
            console.log("addLocation", e);
        }
    }

    async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {
        if(!this._tableExists) {
            throw new Error("Table does not exist");
        }

        const geoLocations = await this.getAll(lat, lng, maxDistM);
        if (geoLocations.length === 0) {
            return null;
        }

        geoLocations.sort((a, b) => {
            const distA = a.distanceM ?? Number.MAX_SAFE_INTEGER;
            const distB = b.distanceM ?? Number.MAX_SAFE_INTEGER;
            return distA - distB;
        });

        const nearestLoc = geoLocations[0];
        console.log("nearestLoc", nearestLoc);
        return nearestLoc;
    }
}
