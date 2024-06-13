import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  lat: number;
  lng: number;
  width: string;
  height: string;
}

function MyComponent({ lat, lng, width, height }: MapProps) {
  const center = {
    lat: lat,
    lng: lng,
  };
  const containerStyle = {
    width: width,
    height: height,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE",
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

  console.log(map);

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
