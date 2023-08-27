import {GeocoderCacheMem} from "../geocoders/geocoder.cache.mem.ts";
import {GeoLocation} from "../geocoders/Location.ts";

describe('GeoCoderCacheMem', () => {

    // Tests that adding a location to the cache is successful
    it('should add a location to the cache', () => {
        const cache = new GeocoderCacheMem();
        const location = new GeoLocation(37.7749, -122.4194);
        cache.addLocation(location);
        expect(cache.locations.length).toBe(1);
        expect(cache.locations[0]).toBe(location);
        expect(cache.locations[0].cached).not.toBe(null);
    });

    // Tests that getting the nearest location from the cache is successful
    it('should get the nearest location from the cache', async () => {
        const cache = new GeocoderCacheMem();
        const lat = 37.7749;
        const lng = -122.4194;
        const location1 = new GeoLocation(lat, lng);
        const location2 = new GeoLocation(lat + 10, lng + 10);
        await cache.addLocation(location1);
        await cache.addLocation(location2);
        const nearestLocation = await cache.getNearest(lat, lng, 1000);
        expect(nearestLocation).toBe(location1);
    });

    // Tests that getting the nearest location from the cache with a maximum distance is successful
    it('should get the nearest location from the cache with a maximum distance', async () => {
        const cache = new GeocoderCacheMem();
        const location1 = new GeoLocation(37.7749, -122.4194);
        const location2 = new GeoLocation(34.0522, -118.2437);
        await cache.addLocation(location1);
        await cache.addLocation(location2);
        const nearestLocation = await cache.getNearest(37.7749, -122.4194, 1000);
        expect(nearestLocation).toBe(location1);
    });

    // Tests that getting the nearest location from the cache with a maximum distance of 0 is successful
    it('should get the nearest location from the cache with a maximum distance of 0', async () => {
        const cache = new GeocoderCacheMem();
        const location1 = new GeoLocation(37.7749, -122.4194);
        const location2 = new GeoLocation(34.0522, -118.2437);
        await cache.addLocation(location1);
        await cache.addLocation(location2);
        const nearestLocation = await cache.getNearest(5.7749, -25.4194, 0);
        expect(nearestLocation).toBe(null);
    });

    // Tests that getting the nearest location from an empty cache returns null
    it('should return null when getting the nearest location from an empty cache', async () => {
        const cache = new GeocoderCacheMem();
        const nearestLocation = await cache.getNearest(37.7749, -122.4194, 1000);
        expect(nearestLocation).toBe(null);
    });


    it('should return just one location when multiple are in range', async () => {
        const cache = new GeocoderCacheMem();
        const location1 = new GeoLocation(52.3454, 4.8975);
        const location2 = new GeoLocation(52.3453, 4.8976);
        await cache.addLocation(location1);
        await cache.addLocation(location2);
//        const nearestLocation = await cache.getNearest(52.3454, 4.8975, 10000);
//        expect(nearestLocation).not.toBe(null);
    });

});
