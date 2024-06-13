"use client";
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

interface Library {
  name: string;
  photos?: { photo_reference: string }[];
  opening_hours?: { open_now: boolean };
  rating?: number;
  vicinity: string;
  place_id: string;
}

interface Comment {
  place_name: string;
  username: string;
  comment: string;
  rating: string;
}

interface LibraryProps {
  sortByRating: boolean;
  sortByNomadRating: boolean;
  showOnlyOpen: boolean;
}

const Page: React.FC<LibraryProps> = ({ sortByRating, sortByNomadRating, showOnlyOpen }) => {
  const [places, setPlaces] = useState<Library[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { averageRates } = useAverageRate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesResponse, commentsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/library"),
          axios.get("http://127.0.0.1:8000/comments")
        ]);

        const placesData = await placesResponse.data;
        const commentsData = await commentsResponse.data;

        let sortedPlaces = placesData.results;

        sortedPlaces = sortedPlaces.sort((a: Library, b: Library) => {
          let result = 0;

          if (sortByRating) {
            const aRating = a.rating || 0;
            const bRating = b.rating || 0;
            result = bRating - aRating;
          }

          if (sortByNomadRating && result === 0) {
            const aNomadRating = parseFloat(getAverageRating(a.name));
            const bNomadRating = parseFloat(getAverageRating(b.name));
            if (!isNaN(aNomadRating) && !isNaN(bNomadRating)) {
              result = bNomadRating - aNomadRating;
            } else if (!isNaN(aNomadRating)) {
              result = -1;
            } else if (!isNaN(bNomadRating)) {
              result = 1;
            }
          }

          return result;
        });

        if (sortByRating && sortByNomadRating) {
          sortedPlaces = sortedPlaces.sort((a: Library, b: Library) => {
            const aTotalRating = (a.rating || 0) + parseFloat(getAverageRating(a.name)) || 0;
            const bTotalRating = (b.rating || 0) + parseFloat(getAverageRating(b.name)) || 0;
            return bTotalRating - aTotalRating;
          });
        }

        if (showOnlyOpen) {
          sortedPlaces = sortedPlaces.filter((place: Library) => {
            return place.opening_hours?.open_now === true;
          });
        }

        setPlaces(sortedPlaces);
        setComments(commentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlaces([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [sortByRating, sortByNomadRating, showOnlyOpen]);

  const getAverageRating = (placeName: string) => {
    const placeComments = comments.filter(comment => comment.place_name === placeName);
    if (placeComments.length === 0) return "Değerlendirme Yok";

    const totalRating = placeComments.reduce((sum, comment) => sum + parseFloat(comment.rating), 0);
    const averageRating = totalRating / placeComments.length;
    return isNaN(averageRating) ? "Değerlendirme Yok" : averageRating.toFixed(2);
  };

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
            <p className="my-4 font-bold text-xl">{place.name}</p>
            <p className="my-4 ">Adres: {place.vicinity}</p>
            <p className="my-4">
              Çalışma Durumu:{" "}
              {place.opening_hours?.open_now ? "Açık" : "Kapalı"}
            </p>
            <p className="my-4">Google Değerlendirme: {place.rating}</p>
            <p className="my-4">Nomad Değerlendirme: {getAverageRating(place.name)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
