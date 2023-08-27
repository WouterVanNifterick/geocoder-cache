export interface ResponseLocation {
    formattedAddress: string;
    address?: object;
    type: string;
    latitude: number;
    longitude: number;
    confidence?: number;
    googlePlaceId?: string;
    level1long?: string;
    level1short?: string;
    level2long?: string;
    level2short?: string;
    city?: string;
    streetName?: string;
    streetNumber?: string;
    country?: string;
    countryCode?: string;
    zipcode?: string;
    provider?: string;
    source?: string;
    state?: string;
    stateCode?: string;
    county?: string;
    district?: string;
    building?: string;
    cached?: string;
    distanceM?: number;
}

export interface ApiReverseGeocodeResponseModel {
    status: {
        code: number;
        message: string;
    },
    stats: {
        processingTimeMs: number;
        fromCache: boolean;
    },
    locations: ResponseLocation[];
}