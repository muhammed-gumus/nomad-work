"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "../../../components/Maps";
import Navbar from "@/components/Navbar";
import Modal from "@/components/ImageModal";
import Link from "next/link";
import Image from "next/image";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center mt-8">
    <div className="animate-spin rounded-full h-36 w-36 border-t-8 border-white"></div>
    <span className="ml-6 text-2xl font-semibold text-white">
      Yükleniyor...
    </span>
  </div>
);

interface PageProps {
  params: {
    id: string;
  };
}

interface Place {
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

interface Comment {
  comment: string;
  username: string;
  place_name: string;
  rating: number;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = params;

  const [place, setPlace] = useState<Place | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [averageRate, setAverageRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const responses = await Promise.all([
          axios.get("http://127.0.0.1:8000/cafe"),
          axios.get("http://127.0.0.1:8000/restaurant"),
          axios.get("http://127.0.0.1:8000/library"),
        ]);

        const data = responses.flatMap((response) => response.data.results);
        const selectedPlace = data.find(
          (place: Place) => place.place_id === id
        );

        setPlace(selectedPlace || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlace(null);
      }
    };

    fetchPlaceData();
  }, [id]);

  useEffect(() => {
    if (place) {
      axios
        .get("http://127.0.0.1:8000/comments")
        .then((response) => {
          const filteredComments = response.data.filter(
            (comment: any) => comment.place_name === place.name
          );
          setComments(filteredComments);

          if (filteredComments.length > 0) {
            var total: number = 0;
            for (var i = 0; i < comments.length; i++) {
              var temp: number = +comments[i].rating;
              total = total + temp;
            }
            var averageRate: number = total / comments.length;

            setAverageRate(averageRate);
          } else {
            setAverageRate(null);
          }
        })
        .catch((error) => {
          console.error("Yorumları çekerken bir hata oluştu:", error);
        });
    }
  }, [place, comments]);

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageUrl(null);
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() !== "" && place) {
      const username = localStorage.getItem("username") || "Anonim";
      const commentWithUsername: Comment = {
        comment: newComment,
        username: username,
        place_name: place.name,
        rating: 0,
      };

      try {
        const ratingResponse = await axios.post(
          "http://127.0.0.1:8000/rating",
          { comment: newComment }
        );
        const predictedRating = ratingResponse.data.predicted_rating;
        commentWithUsername.rating = predictedRating;

        await axios.post("http://127.0.0.1:8000/comments", commentWithUsername);

        setComments((prevComments) => [
          ...prevComments,
          { ...commentWithUsername, rating: predictedRating },
        ]);

        setNewComment("");
      } catch (error) {
        console.error("Yorum gönderme hatası:", error);
      }
    }
  };

  if (!place) {
    return <LoadingSpinner />;
  }

  const averageRating = place.rating || 0;
  const totalRatings = place.user_ratings_total || 0;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex flex-row py-8 px-4 justify-center mt-8 bg-white bg-opacity-80 rounded-lg w-2/3">
        <div className="flex flex-col justify-center items-start w-full px-8 gap-4 rounded-lg">
          <div>
            {place.photos && place.photos.length > 0 ? (
              <Image
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                className="rounded-full object-cover h-52 w-52 cursor-pointer hover:scale-110"
                alt={`${place.name} Photo`}
                onClick={() =>
                  place.photos &&
                  place.photos[0] &&
                  handleImageClick(
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${place.photos[0]?.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                  )
                }
                width={208}
                height={208}
              />
            ) : (
              <Image
                src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
                className="rounded-full object-cover h-40 w-40"
                alt="Default Photo"
                width={160}
                height={160}
              />
            )}
            {modalImageUrl && (
              <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
            )}
          </div>
          <div className="flex flex-col items-start">
            <p className="tracking-[.05em] mb-2 text-3xl font-bold">
              {place.name}
            </p>

            <p>
              {"Nomad Değerlendirme: " +
                (averageRate !== null ? averageRate.toFixed(1) : "Yok")}
            </p>
            <p>{"Google Değerlendirme: " + averageRating.toFixed(1)}</p>

            <p>
              {place.opening_hours?.open_now == true
                ? "Çalışma Durumu : (Açık)"
                : "Çalışma Durumu : (Kapalı)"}
            </p>
            <p>{"Adres: " + place.vicinity}</p>
            <Link href="#form">
              <button className="flex flex-row gap-3 items-center justify-center text-white px-4 py-2 rounded-lg text-l bg-black transition duration-300 hover:scale-110 mt-2">
                DEĞERLENDİR
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.75735 5.63605L6.34314 7.05026L12 12.7071L17.6569 7.05029L16.2427 5.63608L12 9.87872L7.75735 5.63605Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.34314 12.7071L7.75735 11.2929L12 15.5356L16.2427 11.2929L17.6569 12.7071L12 18.364L6.34314 12.7071Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <Map
            lat={place.geometry.location.lat}
            lng={place.geometry.location.lng}
            width="80%"
            height="400px"
          />
        </div>
      </div>
      <div className="flex flex-col py-4 items-center mt-8 justify-center bg-white bg-opacity-80 rounded-lg w-2/3">
        <p className="text-2xl font-bold ">DEĞERLENDİRMELER</p>
        <ul className="flex flex-col gap-4 w-3/4 mt-4">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="p-4 bg-white bg-opacity-60 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <svg
                  className="w-6 h-6 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-7a1 1 0 112-0 1 1 0 01-2 0zm0 4a1 1 0 112-0 1 1 0 01-2 0zm0-8a1 1 0 112-0 1 1 0 01-2 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-700 font-semibold">
                  {comment.username}
                </p>
              </div>
              <p className="text-gray-700">{comment.comment}</p>
              <p className="text-gray-500 text-sm">Rating: {comment.rating}</p>
            </li>
          ))}
        </ul>
        <div id="form" className="mt-8 w-full px-8">
          <p className="text-xl font-bold mb-2">Değerlendirme Ekle</p>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu buraya yazın..."
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleSubmitComment}
            className="mt-2 px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Gönder
          </button>
        </div>
      </div>
      <div className="h-8"></div>
    </div>
  );
};

export default Page;
