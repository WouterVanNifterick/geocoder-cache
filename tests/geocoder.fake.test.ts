import {GeoLocation} from "../geocoders/Location.ts";
import {GeocoderFake} from "../geocoders/geocoder.fake.ts";

describe('GeoCoderFake', () => {

    // Tests that getting a location is successful
    it('should get a location', async () => {
        const sut = new GeocoderFake();
        const lat = 37.7749;
        const lng = -122.4194;
        const nearestLocation = await sut.getNearest(lat, lng, 1000);
        expect(nearestLocation).not.toBe(null);
    });
});
