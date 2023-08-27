import {GeocoderCacheMem} from "./geocoder.cache.mem.ts";
import {GeoLocation} from "./Location.ts";
import {DynamoDbGeoCoder} from "./GeoCoder.Cache.DynamoDb.ts";
import {GeocoderNode} from "./geocoder.node.ts";
import {GeoLocationCache, ReverseGeoCoder} from "../interfaces/geocoder.ts";

export class GeocoderGeneric implements ReverseGeoCoder, GeoLocationCache {
    constructor(
        public geoCoders: { [s: string]: ReverseGeoCoder | GeoLocationCache; } =
            {
            cache: new GeocoderCacheMem(),
            dynamoDb: new DynamoDbGeoCoder(),
            node: new GeocoderNode(),
//        fake: new GeoCoderFake(),
//        nominatim: new GeoCoderNominatim(),
//        googleMaps: new GeoCoderGoogleMaps(),
        }
    ) {

    }

    async addLocation(geoLocation: GeoLocation): Promise<void> {
        await this.cache.addLocation(geoLocation);
        await this.storage.addLocation(geoLocation);
    }
    async getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]> {
        const nearest = await this.getNearest(lat, lng, maxDistM);
        const all:GeoLocation[] = [];
        if(nearest) {
            all.push(nearest);
        }
        return all;
    }

    get cache(): GeocoderCacheMem {
        return this.geoCoders.cache as GeocoderCacheMem;
    }

    get storage(): DynamoDbGeoCoder {
        return this.geoCoders.dynamoDb as DynamoDbGeoCoder;
    }

    async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {
        let loc = null;
        for (const reverseGeoCoder of Object.values(this.geoCoders)) {
            try {
                loc = await reverseGeoCoder.getNearest(lat, lng, maxDistM);
                if (loc !== null) {
                    break;
                }
            } catch (ex) {
                console.error("getNearest", ex);
            }
        }
        if (loc !== null) {
            const geoLoc = new GeoLocation(lat, lng, loc.address, loc.source, loc.provider, new Date());
            await this.cache.addLocation(geoLoc);
            await this.storage.addLocation(geoLoc);
        }
        return loc;
    }
}