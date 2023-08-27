import {GeoLocation} from "../geocoders/Location.ts";

export interface ReverseGeoCoder {
  getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]>;
  getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null>;
}

export interface GeoLocationCache extends ReverseGeoCoder {
    addLocation(geoLocation: GeoLocation): Promise<void>;
}