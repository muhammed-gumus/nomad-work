import React, { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  lat: number;
  lng: number;
  width: string;
  height: string;
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  throw new Error("Google Maps API key is not defined in environment variables");
}

function MyComponent({ lat, lng, width, height }: MapProps) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const containerStyle = {
    width: width,
    height: height,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey as string,
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(
    function callback(googleMap: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      googleMap.fitBounds(bounds);

      setMap(googleMap);
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={20}
      onUnmount={onUnmount}
    >
      <Marker
        position={{ lat, lng }}
        animation={google.maps.Animation.BOUNCE} 
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
