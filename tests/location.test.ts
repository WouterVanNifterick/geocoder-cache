import {GeoLocation} from "../geocoders/Location.ts";

describe('GeoLocation', () => {

    // Tests that a new GeoLocation object can be created with valid parameters.
    it('should create a new GeoLocation object with valid parameters', () => {
        const lat = 37.7749;
        const lng = -122.4194;
        const address = "San Francisco";
        const source = "Google Maps";
        const provider = "Google";
        const cached = new Date();

        const geoLocation = new GeoLocation(lat, lng, address, source, provider, cached);
        expect(geoLocation.lat).toBe(lat);
        expect(geoLocation.lng).toBe(lng);
        expect(geoLocation.address).toBe(address);
        expect(geoLocation.source).toBe(source);
        expect(geoLocation.provider).toBe(provider);
        expect(geoLocation.cached).toBeInstanceOf(Date);
        expect(geoLocation.cached).toBe(cached);
    });

    // Tests that the getDistanceMLatLng method returns the correct distance when called with valid parameters.
    it('should return the correct distance when calling getDistanceMLatLng with valid parameters', () => {
        const lat = 37.7749;
        const lng = -122.4194;
        const geoLocation = new GeoLocation(lat, lng);
        const distance = geoLocation.getDistanceMLatLng(lat, lng);
        expect(distance).toBe(0);
    });

    // Tests that the getDistanceMLoc method returns the correct distance when called with a valid GeoLocation object parameter.
    it('should return the correct distance when calling getDistanceMLoc with a valid GeoLocation object parameter', () => {
        const lat = 37.7749;
        const lng = -122.4194;
        const geoLocation1 = new GeoLocation(lat, lng);
        const geoLocation2 = new GeoLocation(lat, lng);
        const distance = geoLocation1.getDistanceMLoc(geoLocation2);
        expect(distance).toBe(0);
    });

    // Tests that a new GeoLocation object can be created with an empty address parameter.
    it('should create a new GeoLocation object with an empty address parameter', () => {
        const lat = 37.7749;
        const lng = -122.4194;
        const address = null;
        const source = "Google Maps";
        const provider = "Google";
        const cached = new Date();
        const geoLocation = new GeoLocation(lat, lng, address, source, provider, cached);

        expect(geoLocation.address).toBe(null);
    });

});
