"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center mt-8">
    <div className="animate-spin rounded-full h-36 w-36 border-t-8 border-white"></div>
    <span className="ml-6 text-2xl font-semibold text-white">
      Yükleniyor...
    </span>
  </div>
);

interface Restaurant {
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
  rating: string;  // Backend'den string olarak geldiği için burada da string
}

interface RestaurantProps {
  sortByRating: boolean;
  showOnlyOpen: boolean;
  sortByNomadRating: boolean;
}

const Restaurant: React.FC<RestaurantProps> = ({ sortByRating, showOnlyOpen, sortByNomadRating }) => {
  const [places, setPlaces] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]); // Yorumları tutmak için bir state tanımla

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, commentsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/restaurant"),
          axios.get("http://127.0.0.1:8000/comments")
        ]);

        const data = await response.data;
        const commentsData = await commentsResponse.data;

        setPlaces(data.results);
        setComments(commentsData); // Yorumları state'e ekle
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlaces([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNomadRating = (placeName: string): string => {
    const placeComments = comments.filter(comment => comment.place_name === placeName);
    if (placeComments.length === 0) return "Değerlendirme Yok";
  
    const totalRating = placeComments.reduce((sum, comment) => sum + parseFloat(comment.rating), 0);
    const averageRating = totalRating / placeComments.length;
    return isNaN(averageRating) ? "Değerlendirme Yok" : averageRating.toFixed(2);
  };

  const filterAndSortPlaces = (places: Restaurant[]): Restaurant[] => {
    let filteredPlaces = [...places];

    if (showOnlyOpen) {
      filteredPlaces = filteredPlaces.filter(place => place.opening_hours?.open_now);
    }

    if (sortByRating && sortByNomadRating) {
      filteredPlaces.sort((a, b) => {
        const aNomadRating = parseFloat(getNomadRating(a.name)) || 0;
        const bNomadRating = parseFloat(getNomadRating(b.name)) || 0;
        const aTotalRating = (a.rating || 0) + aNomadRating;
        const bTotalRating = (b.rating || 0) + bNomadRating;
        return bTotalRating - aTotalRating;
      });
    } else if (sortByRating) {
      filteredPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortByNomadRating) {
      filteredPlaces.sort((a, b) => {
        const aNomadRating = parseFloat(getNomadRating(a.name)) || 0;
        const bNomadRating = parseFloat(getNomadRating(b.name)) || 0;
        return bNomadRating - aNomadRating;
      });
    }

    return filteredPlaces;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const sortedAndFilteredPlaces = filterAndSortPlaces(places);

  return (
    <div className="flex w-full justify-center flex-col items-center my-16 gap-4">
      {sortedAndFilteredPlaces.map((place, index) => (
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
            <p className="my-4">Google Değerlendirme: {place.rating}</p>
            <p className="my-4">Nomad Değerlendirme: {getNomadRating(place.name)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Restaurant;
