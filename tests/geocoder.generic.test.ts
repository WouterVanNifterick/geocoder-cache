import {GeocoderGeneric} from "../geocoders/geocoder.generic.ts";
import {GeoLocation} from "../geocoders/Location.ts";
import {GeoLocationCache} from "../interfaces/geocoder.ts";

describe('GeoCoderGeneric', () => {

    // Tests that adding a location to the sut is successful
    it('should add a location to the sut', async() => {
        const sut:GeoLocationCache = new GeocoderGeneric();
        const lat = 37.7749;
        const lng = -122.4194;
        const location = new GeoLocation(lat, lng);
        await sut.addLocation(location);
        const locations = await sut.getAll(lat, lng, 1000);
        expect(locations.length).toBe(1);
        expect(locations[0]).toBe(location);
        expect(locations[0].cached).not.toBe(null);
    });

    // Tests that getting the nearest location from the sut is successful
    it('should get the nearest location from the sut', async () => {
        const sut = new GeocoderGeneric();
        const lat = 37.7749;
        const lng = -122.4194;
        const location1 = new GeoLocation(lat, lng);
        const location2 = new GeoLocation(lat + 10, lng + 10);
        await sut.addLocation(location1);
        await sut.addLocation(location2);
        const nearestLocation = await sut.getNearest(lat, lng, 1000);
        expect(nearestLocation).toBe(location1);
    });

    // Tests that getting the nearest location from the sut with a maximum distance is successful
    it('should get the nearest location from the sut with a maximum distance', async () => {
        const sut = new GeocoderGeneric();
        const location1 = new GeoLocation(37.7749, -122.4194);
        const location2 = new GeoLocation(34.0522, -118.2437);
        await sut.addLocation(location1);
        await sut.addLocation(location2);
        const nearestLocation = await sut.getNearest(37.7749, -122.4194, 1000);
        expect(nearestLocation).toBe(location1);
    });

    // Tests that getting the nearest location from the sut with a maximum distance of 0 is successful
    it('should get the nearest location from the sut with a maximum distance of 0', async () => {
        const sut = new GeocoderGeneric();
        const location1 = new GeoLocation(37.7749, -122.4194);
        const location2 = new GeoLocation(34.0522, -118.2437);
        await sut.addLocation(location1);
        await sut.addLocation(location2);
    //  const nearestLocation = await sut.getNearest(5.7749, -25.4194, 0);
    //  expect(nearestLocation).toBe(null);
    });

    // Tests that getting the nearest location from an empty sut returns null
    it('should return null when getting the nearest location from an empty sut', async () => {
        // const sut = new GeoCoderGeneric();
        // const nearestLocation = await sut.getNearest(37.7749, -122.4194, 1000);
        // expect(nearestLocation).toBe(null);
    });


    it('should return just one location when multiple are in range', async () => {
        const sut = new GeocoderGeneric();
        const location1 = new GeoLocation(52.3454, 4.8975);
        const location2 = new GeoLocation(52.3453, 4.8976);
        await sut.addLocation(location1);
        await sut.addLocation(location2);
        const nearestLocation = await sut.getNearest(52.3454, 4.8975, 10000);
        expect(nearestLocation).not.toBe(null);
    });

});
