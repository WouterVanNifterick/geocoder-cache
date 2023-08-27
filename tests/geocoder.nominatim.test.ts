import {GeocoderNominatim} from "../geocoders/geocoder.nominatim.ts";
import {GeoLocation} from "../geocoders/Location.ts";

describe('GeoCoderNominatim', () => {

    // Tests that a new instance of GeoCoderNominatim can be successfully created
    it('should create a new instance of GeoCoderNominatim', async () => {
      const ddbGeoCoder = new GeocoderNominatim();
      expect(ddbGeoCoder).toBeInstanceOf(GeocoderNominatim);
    });


    // Tests that the getNearest method returns null if no locations are found within the specified distance
    it('should return null if no locations are found within the specified distance', async () => {
      const ddbGeoCoder = new GeocoderNominatim();
      const nearestLoc = await ddbGeoCoder.getNearest(99.000, -99.000, 10);
      expect(nearestLoc).toBeNull();
    });

});
