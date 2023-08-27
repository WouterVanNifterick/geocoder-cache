import {GeoLocation} from "./Location.ts";
// @ts-ignore
import Nominatim from "nominatim-geocoder";
import {ReverseGeoCoder} from "../interfaces/geocoder.ts";

export class GeocoderNominatim implements ReverseGeoCoder {
    nominatim = new Nominatim();

    async getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]> {
        const q = `${lat},${lng}`;
        try {
            const address = await this.nominatim.search({ q });
            const geoLocations = address.map((a: any) => {
                const loc = new GeoLocation(lat, lng, a, "nominatim", "nominatim", new Date());
                loc.distanceM = loc.getDistanceMLatLng(lat, lng);
                return loc;
            });
            geoLocations.sort((a:GeoLocation, b:GeoLocation) => a.distanceM! - b.distanceM!);
            return geoLocations;
        } catch (e) {
            return [];
        }
    }

    async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {
        const all = await this.getAll(lat, lng, maxDistM);
        if (all === null || all.length === 0) {
            return null;
        }
        const loc = all[0];
        if(loc.distanceM! > maxDistM) {
            return null;
        }
        return all[0];
    }
}