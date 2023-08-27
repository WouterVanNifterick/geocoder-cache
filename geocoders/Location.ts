export class GeoLocation {
    public distanceM?: number;

    constructor(
        public lat: number,
        public lng: number,
        public address: Record<string, any> = {},
        public source: string = "",
        public provider: string = "",
        public cached: Date = new Date(),
    ) {
    }

    get coordinateId() {
        return `${this.lat.toFixed(5)}_${this.lng.toFixed(5)}`;
    }

    getDistanceMLoc(geoLocation: GeoLocation) {
        const {lat, lng} = geoLocation;
        return this.getDistanceMLatLng(lat, lng);
    }

    getDistanceMLatLng(lat: number, lng: number): number {
        const R = 6371e3; // metres
        const φ1 = this.lat * Math.PI / 180;
        const φ2 = lat * Math.PI / 180;
        const Δφ = (lat - this.lat) * Math.PI / 180;
        const Δλ = (lng - this.lng) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}