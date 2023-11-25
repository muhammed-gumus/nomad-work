import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "500px",
  height: "450px",
};

const center = {
  lat: 38.0204632,
  lng: 32.5090583,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD2_a8WBjvm2Hqv4SKmIpyDkit9w2295aM",
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
      <marker>mammiiiiii</marker>
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
