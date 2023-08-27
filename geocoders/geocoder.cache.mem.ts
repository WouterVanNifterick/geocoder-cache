import {GeoLocation} from "./Location.ts";
import {GeoLocationCache, ReverseGeoCoder} from "../interfaces/geocoder.ts";

/*
  This is a simple in-memory cache for GeoLocations.
  Super fast, but not persistent.
*/
export class GeocoderCacheMem implements ReverseGeoCoder, GeoLocationCache {
  locations: GeoLocation[] = [];

  async getAll(lat: number, lng: number, maxDistM: number): Promise<GeoLocation[]> {
    return this.locations;
  }

  async getLocationsInRadius(lat: number, lng: number, radiusM: number): Promise<GeoLocation[]> {
    const locs = await this.getAll(lat, lng, radiusM);
    const locsInRadius: GeoLocation[] = [];
    for (const location of locs) {
      const distanceM = location.getDistanceMLatLng(lat,lng);
      if (distanceM < radiusM) {
        locsInRadius.push(location);
      }
    }
    console.log("locsInRadius", locsInRadius);
    return locsInRadius;
  }

  async getNearest(lat: number, lng: number, maxDistM: number): Promise<GeoLocation | null> {
    let searchLoc = new GeoLocation(lat, lng);
    let nearestLoc: GeoLocation | null = null;
    let nearestDistanceM = Number.MAX_SAFE_INTEGER;
    const locs = await this.getAll(lat, lng, maxDistM);
    for (const location of locs) {
      const distanceM = location.getDistanceMLoc(searchLoc);
      if (distanceM > maxDistM) {
        continue;
      }
      if (nearestDistanceM === null || distanceM < nearestDistanceM) {
        nearestLoc = location;
        nearestDistanceM = distanceM;
      }
      if (nearestDistanceM < 25)
        break;
    }
    if (nearestLoc === null) {
      return null;
    }
    nearestLoc.distanceM = nearestDistanceM;
    nearestLoc.source = "Memory Cache";
    console.log("nearestLoc", nearestLoc);
    return nearestLoc;
  }

  async addLocation(loc:GeoLocation) {
    loc.source = "Memory Cache";
    const nearest = await this.getNearest(loc.lat, loc.lng, 1);
    if (nearest !== null) {
      return;
    }
    console.log("addLocation", loc.lat, loc.lng, loc.source, loc.provider);
    this.locations.push(loc);
  }
}