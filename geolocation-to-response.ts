import {GeoLocation} from "./geocoders/Location.ts";
import {ResponseLocation} from "./interfaces/api.reverse-geocode.response.model.ts";

export const geoLocationToResponseLocation = (nearest: GeoLocation): ResponseLocation => {
    return {
        formattedAddress: nearest.address.formattedAddress,
        type: "Point",
        latitude: nearest.lat,
        longitude: nearest.lng,
        confidence: nearest.address?.extra?.confidence ?? 1,
        // address:nearest.address,
        googlePlaceId: nearest.address?.extra?.googlePlaceId,
        level1long: nearest.address?.administrativeLevels?.level1long,
        level1short: nearest.address?.administrativeLevels?.level1short,
        level2long: nearest.address?.administrativeLevels?.level2long,
        level2short: nearest.address?.administrativeLevels?.level2short,
        city: nearest.address?.city,
        streetName: nearest.address?.streetName,
        streetNumber: nearest.address?.streetNumber,
        country: nearest.address?.country,
        countryCode: nearest.address?.countryCode,
        zipcode: nearest.address?.zipcode,
        provider: nearest?.provider,
        state: nearest.address?.state,
        stateCode: nearest.address?.stateCode,
        county: nearest.address?.county,
        district: nearest.address?.district,
        building: nearest.address?.building,
        source: nearest.source,
        cached: nearest.cached?.toISOString(),
        distanceM: nearest.distanceM,
    };
}