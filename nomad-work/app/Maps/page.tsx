import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "500px",
  height: "450px",
};

interface MapProps {
  lat: number;
  lng: number;
}

function MyComponent({ lat, lng }: MapProps) {
  const center = {
    lat: lat,
    lng: lng,
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

  // 'map' değişkenini okuyorsunuz
  console.log(map);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onUnmount={onUnmount}
    >
      {/* Marker componenti yerine Marker elementi kullanılmalı */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
