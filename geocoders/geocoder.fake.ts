import {GeoLocation} from "./Location.ts";
import {ReverseGeoCoder} from "../interfaces/geocoder.ts";

/*
    This is a simple in-memory reverse geolocation provider
    It's for testing purposes only, and only returns fake data.
    Don't use this in production.
*/

export class GeocoderFake implements ReverseGeoCoder {
  async getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]> {
    return [await this.getNearest(lat, lng, maxDistM) as GeoLocation];
  }
  async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {
    const loc = new GeoLocation(lat, lng);
    loc.source = "Fake Source";
    loc.provider = "Fake Provider";
    loc.distanceM = undefined;
    loc.address = {
      road: "Fake Road",
      city: "Fake City",
      state: "Fake State",
      postcode: "Fake Postcode",
      country: "Fake Country",
      country_code: "Fake Country Code",
    };
    return loc;
  }
}