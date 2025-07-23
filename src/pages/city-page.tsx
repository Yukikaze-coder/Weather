import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import WeatherSkeleton from "@/components/ui/loading-skeleton";
import CurrentWeather from "@/components/ui/current-weather";
import HourlyTemperature from "@/components/ui/hourly-temperature";
import WeatherDetails from "@/components/ui/weather-details";
import WeatherForecast from "@/components/ui/weather-forecast";
import FavoriteButton from "@/components/ui/favorite-button";


const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);

      if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          Failed to fetch weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

   if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
          </h1>
          <div>
            <FavoriteButton 
            data={{...weatherQuery.data, name: params.cityName }}
            />
          </div>
        
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather 
           data={weatherQuery.data} />
           
          
          <HourlyTemperature data={forecastQuery.data} />
          {/* Hourly temperature */}
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* Forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
}

export default CityPage