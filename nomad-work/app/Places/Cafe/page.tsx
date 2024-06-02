"use client";
// Cafe component
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAverageRate } from "@/context/AverageRateContext";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center mt-8">
    <div className="animate-spin rounded-full h-36 w-36 border-t-8 border-white"></div>
    <span className="ml-6 text-2xl font-semibold text-white">
      Yükleniyor...
    </span>
  </div>
);

interface Cafe {
  name: string;
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now: boolean };
  rating?: number;
  user_ratings_total?: number;
  vicinity: string;
  place_id: string;
}

interface CafeProps {
  sortByRating: boolean;
  showOnlyOpen: boolean;
}

const Page: React.FC<CafeProps> = ({ sortByRating, showOnlyOpen }) => {
  const [places, setPlaces] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { averageRates } = useAverageRate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cafe");
        const data = await response.data;

        let sortedPlaces = data.results;

        if (sortByRating) {
          sortedPlaces = sortedPlaces.sort((a: Cafe, b: Cafe) => {
            if (a.rating && b.rating) {
              return b.rating - a.rating;
            } else {
              return 0;
            }
          });
        }

        if (showOnlyOpen) {
          sortedPlaces = sortedPlaces.filter((place: Cafe) => {
            return place.opening_hours?.open_now === true;
          });
        }

        setPlaces(sortedPlaces);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlaces([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [sortByRating, showOnlyOpen]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex w-full justify-center flex-col items-center my-16 gap-4">
      {places.map((place) => (
        <Link
          className="flex flex-row items-start bg-white w-2/3 py-8 px-8 gap-8 rounded-lg"
          href={`/PlaceDetails/${place.place_id}`}
          key={place.place_id}
        >
          {place.photos && place.photos.length > 0 ? (
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
              className="rounded-full object-cover h-40 w-40"
              alt={`${place.name} Photo`}
            />
          ) : (
            <img
              src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
              className="rounded-full object-cover h-40 w-40"
              alt="Default Photo"
            />
          )}
          <div>
            <p className="my-4 font-bold">{place.name}</p>
            <p className="my-4 ">Adres: {place.vicinity}</p>
            <p className="my-4">
              Çalışma Durumu:{" "}
              {place.opening_hours?.open_now ? "Açık" : "Kapalı"}
            </p>
            <p className="my-4">Google Rating: {place.rating}</p>
            <p className="my-4">User Rating: {place.user_ratings_total}</p>
            <p className="my-4">Average Rate: {averageRates[place.place_id]}</p> {/* averageRates eklenmesi */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
