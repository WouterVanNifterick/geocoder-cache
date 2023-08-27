export interface ApiReverseGeocodeRequestModel {
    lat: number;
    lng: number;
    maxDistM?: number;
    maxResults?: number;
    provider?: string;
}