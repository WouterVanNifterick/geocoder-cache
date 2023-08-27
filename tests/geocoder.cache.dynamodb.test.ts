import {DynamoDbGeoCoder} from "../geocoders/geocoder.cache.dynamodb.ts";
import {GeoLocation} from "../geocoders/Location.ts";

describe('DynamoDbGeoCoder', () => {

    // Tests that a new instance of DynamoDbGeoCoder can be successfully created
    it('should create a new instance of DynamoDbGeoCoder', () => {
      const ddbGeoCoder = new DynamoDbGeoCoder();
      expect(ddbGeoCoder).toBeInstanceOf(DynamoDbGeoCoder);
    });

    // Tests that the tableExists method returns the correct table name if the table exists
    it('should return the correct table name if the table exists', async () => {
      const ddbGeoCoder = new DynamoDbGeoCoder();
      const tableExists = await ddbGeoCoder.tableExists();
      expect(tableExists).toBeTruthy();
    });

    // Tests that a new table can be successfully created
    it('should create a new table', async () => {
      const ddbGeoCoder = new DynamoDbGeoCoder();
      // check if ddbGeoCoder.createTable() throws an exception

      expect(ddbGeoCoder).toBeInstanceOf(DynamoDbGeoCoder);
      expect(ddbGeoCoder.tableExists()).toBeTruthy();
    });

    // Tests that a new location can be successfully added
    it('should add a new location', async () => {
      const ddbGeoCoder = new DynamoDbGeoCoder();
      await ddbGeoCoder.createTable();
      const lat = 37.7749;
      const lng = -122.4194;
      const loc = new GeoLocation(lat, lng);
      await ddbGeoCoder.addLocation(loc);
      const nearestLoc = await ddbGeoCoder.getNearest(lat, lng, 1000);
      expect(nearestLoc?.lat).toEqual(lat);
      expect(nearestLoc?.lng).toEqual(lng);
      expect(nearestLoc?.cached).not.toBe(null);
      expect(nearestLoc?.distanceM).toBeLessThan(1);


    });

    // Tests that the getNearest method returns null if no locations are found within the specified distance
    it('should return null if no locations are found within the specified distance', async () => {
      const ddbGeoCoder = new DynamoDbGeoCoder();
      await ddbGeoCoder.createTable();
      const nearestLoc = await ddbGeoCoder.getNearest(99.000, -99.000, 10);
      expect(nearestLoc).toBeNull();
    });

});
