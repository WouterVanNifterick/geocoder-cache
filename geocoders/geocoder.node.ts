import {GeoLocation} from "./Location.ts";
import NodeGeocoder from 'node-geocoder';
import 'dotenv/config';
import {ReverseGeoCoder} from "../interfaces/geocoder.ts";

/*
    This is a reverse geocoder, using the node-geocoder library.
    It wraps the node-geocoder library, and returns a GeoLocation object.
    The node-geocoder library supports multiple providers, including Google, Bing, Mapquest, and others.
    See https://www.npmjs.com/package/node-geocoder

    For Google, you need to get an API key from https://developers.google.com/maps/documentation/geocoding/get-api-key
    and set it in the googleMapsApiKey.ts file.

    For Bing, you need to get an API key from https://www.bingmapsportal.com/
    and set it in the bingMapsApiKey.ts file.


*/

export class GeocoderNode implements ReverseGeoCoder {

    provider: string = 'google';
    apiKey: string = process.env.GOOGLE_MAPS_API_KEY ?? '';
    // formatter: string = null;

    geocoder: NodeGeocoder.Geocoder;

    constructor() {
        this.geocoder = NodeGeocoder({
            provider: 'google',
            apiKey: this.apiKey,
    //        formatter: this.formatter
        });
    }

    async getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]> {
        console.warn("getNearest", lat, lng, maxDistM);
        const res = await this.geocoder.reverse({lat: lat, lon: lng});
        const loc0 = res[0];
        const geoLoc = new GeoLocation(
            loc0.latitude ?? 0, loc0.longitude ?? 0,
            loc0, 'node-geocoder', this.provider, new Date());
        return [geoLoc];
    }

    async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {

        console.warn("getNearest", lat, lng, maxDistM);
        const res = await this.geocoder.reverse({lat: lat, lon: lng});
        const loc0 = res[0];

        return new GeoLocation(
            loc0.latitude ?? 0, loc0.longitude ?? 0,
            loc0, 'node-geocoder', this.provider, new Date());
    }
}