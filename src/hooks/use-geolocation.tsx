import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeolocation() {
    const [locationData, setLocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true,
    });

    const getLocation=() => {
        setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

        if (!navigator.geolocation) {
            setLocationData({
                coordinates: null,
                error: "Geolocation is not supported by your browser.",
                isLoading: false,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false,
            });
        }, (error)=>{
            let errorMesssage: string;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMesssage = "Location permission denied. Please enable location acces.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMesssage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMesssage = "The request timed out.";
                    break;
                default:
                    errorMesssage = "An unknown error occurred.";
            }

            setLocationData({
                coordinates: null,
                error: errorMesssage,
                isLoading: false,
            });
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0, 
        });

    };

    useEffect(() => {
        getLocation();
    }, []);

    return {
        ...locationData,
        getLocation
    }
}