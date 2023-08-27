import express from "express";
import bodyParser from "body-parser";
import {GeocoderGeneric} from "./geocoders/geocoder.generic.ts";
import {ApiReverseGeocodeResponseModel} from "./interfaces/api.reverse-geocode.response.model.ts";
import {geoLocationToResponseLocation} from "./geolocation-to-response.ts";
import {ApiReverseGeocodeRequestModel} from "./interfaces/api.reverse-geocode.request.model.ts";
import {GeoLocation} from "./geocoders/Location.ts";
import 'dotenv/config';

const geoCoder = new GeocoderGeneric();

const getNotFoundResponse = ():ApiReverseGeocodeResponseModel => {
    return {
        status: {code: 404, message: "Not found"},
        locations: [],
        stats: {
            processingTimeMs: 0,
            fromCache: false,
        }
    }
}

const handleGetNearestUseCase = async (lat:number, lng:number, maxDistM:number) => {
    return await geoCoder.getNearest(lat, lng, maxDistM);
}

const getRequest = (req: any) => {
    const request: ApiReverseGeocodeRequestModel = {
        lat: parseFloat(req.query.lat as string),
        lng: parseFloat(req.query.lng as string),
        maxDistM: parseFloat(req.query.maxDistM as string),
        maxResults: parseInt(req.query.maxResults as string),
        provider: req.query.provider as string ?? "all",
    }
    return request;
};

function getLocationResponse(nearest: GeoLocation, startTime: number) {
    const responseLocations = [geoLocationToResponseLocation(nearest)];
    const processingTimeMs = Date.now() - startTime;
    return {
        status: {code: 200, message: "OK"},
        locations: responseLocations,
        stats: {
            processingTimeMs: processingTimeMs,
            fromCache: ["Memory Cache", "DynamoDb"].includes(responseLocations[0].source ?? ""),
        }
    }
}

async function handleReverseGeocodeRequest(request: ApiReverseGeocodeRequestModel, res: any) {
    let apiResponse: ApiReverseGeocodeResponseModel;
    const startTime = Date.now();
    const nearest = await handleGetNearestUseCase(request.lat, request.lng, request.maxDistM ?? 1000);
    if (!nearest) {
        apiResponse = getNotFoundResponse();
        return res.status(404).json({apiResponse});
    }
    apiResponse = getLocationResponse(nearest, startTime);
    return res.json(apiResponse);
}

express()
  .use(bodyParser.json())
  .get("/", (req, res) => {
      const request = getRequest(req);
      (
        async () =>
            await handleReverseGeocodeRequest(request, res)
      )();
    }
  )

  .get("/cache", (_req, res) => {
    (
      async () =>
          res.json({
            status: {code: 200, message: "OK"},
            cache:  geoCoder.cache,
          })
    )();
    }
  )

  .listen(process.env.PORT ?? 3000, () => console.log("App listening on port 3000!"));
