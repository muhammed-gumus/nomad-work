"use client";
import React from "react";
import Navbar from "../../Navbar/page";
import { useEffect, useState } from "react";
import axios from "axios";
import Map from "../../Maps/page";

interface PageProps {
  params: {
    id: string; // params prop'unun içindeki id özelliğinin tipini belirtin
  };
}

interface Cafe {
  name: string;
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now: boolean };
  rating?: number;
  vicinity: string;
  place_id: string;
  user_ratings_total: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = params;

  const [place, setPlace] = useState<Cafe | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cafe");
        console.log(response);

        const data = await response.data;
        const filterData = data.results.find((e: any) => {
          return e.place_id === id;
        });

        setPlace(filterData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlace(null);
      }
    };

    fetchData();
  }, [id]);

  console.log(place);

  return (
    <div className="flex flex-col items-center py-4">
      <Navbar />
      {place && (
        <div className="flex justify-between mt-8 w-1/2 items-start">
          <div>
            {place.photos && place.photos.length > 0 ? (
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                className="rounded-full object-cover h-80 w-80"
                alt={`${place.name} Photo`}
              />
            ) : (
              <img
                src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
                className="rounded-full object-cover h-40 w-40"
                alt="Default Photo"
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-bold">{"İsim: " + place.name}</p>
            <p>{"Toplam Değerlendirme: " + place.user_ratings_total}</p>
            <p>{"Puan: " + place.rating}</p>
            <p>
              {place.opening_hours?.open_now == true
                ? "Çalışma Durumu : (Açık)"
                : "Çalışma Durumu : (Kapalı)"}
            </p>
            <p>{place.vicinity}</p>
          </div>
          <Map
            lat={place.geometry.location.lat}
            lng={place.geometry.location.lng}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
