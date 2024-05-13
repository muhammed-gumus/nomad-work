"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Map from "../../../components/Maps";
import Navbar from "@/components/Navbar";
import Modal from "@/components/ImageModal";
import Link from "next/link";

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

interface Restaurant {
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

interface Library {
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

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [library, setLibrary] = useState<Library | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  let placeName: string | undefined;

  if (cafe !== null) {
    placeName = cafe.name;
  } else if (restaurant !== null) {
    placeName = restaurant.name;
  } else if (library !== null) {
    placeName = library.name;
  }

  const handleSubmitComment = async () => {
    if (newComment.trim() !== "" && placeName !== undefined) {
      const username = localStorage.getItem("username") || "Anonim";
      const commentWithUsername: Comment = {
        comment: newComment,
        username: username,
        place_name: placeName,
        rating: 0, // İlk başta rating değerini 0 olarak atıyoruz
      };
  
      try {
        // Yorumu backend'e gönder
        await axios.post("http://127.0.0.1:8000/comments", commentWithUsername);
  
        // Tahmin edilen ratingi al
        const ratingResponse = await axios.post(
          "http://127.0.0.1:8000/rating",
          { comment: newComment }
        );
        const predictedRating = ratingResponse.data.predicted_rating;
  
        // Yorum objesine tahmin edilen ratingi ekleyerek lokal state'i güncelle
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
  

  useEffect(() => {
    if (placeName !== undefined) {
      // Backend'den yorumları çek
      axios
        .get("http://127.0.0.1:8000/comments")
        .then((response) => {
          // Filtreleme: Sadece o anki mekanın yorumlarını al
          const filteredComments = response.data.filter(
            (comment: any) => comment.place_name === placeName
          );
          setComments(filteredComments);
        })
        .catch((error) => {
          console.error("Yorumları çekerken bir hata oluştu:", error);
        });
    }
  }, [placeName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cafe");
        console.log(response);

        const data = await response.data;
        const filterData = data.results.find((e: any) => {
          return e.place_id === id;
        });

        setCafe(filterData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCafe(null);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/restaurant");
        console.log(response);

        const data = await response.data;
        const filterData = data.results.find((e: any) => {
          return e.place_id === id;
        });

        setRestaurant(filterData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRestaurant(null);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/library");
        console.log(response);

        const data = await response.data;
        const filterData = data.results.find((e: any) => {
          return e.place_id === id;
        });

        setLibrary(filterData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLibrary(null);
      }
    };

    fetchData();
  }, [id]);

  // Resme tıklama olayını dinleyen fonksiyon
  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  // Modal'ı kapatma fonksiyonu
  const handleCloseModal = () => {
    setModalImageUrl(null);
  };

  return (
    <div className="flex flex-col items-center py-4 ">
      {cafe ? (
        <div className="flex flex-row py-8 px-4 justify-center mt-8 bg-white bg-opacity-80 rounded-lg w-2/3">
          <div className="flex flex-col justify-center items-start w-full  px-8 gap-4 rounded-lg">
            <div>
              {cafe.photos && cafe.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${cafe.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                  className="rounded-full object-cover h-52 w-52 cursor-pointer hover:scale-110"
                  alt={`${cafe.name} Photo`}
                  onClick={() =>
                    cafe.photos &&
                    cafe.photos[0] &&
                    handleImageClick(
                      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${cafe.photos[0]?.photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`
                    )
                  }
                />
              ) : (
                <img
                  src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
                  className="rounded-full object-cover h-40 w-40"
                  alt="Default Photo"
                />
              )}
              {modalImageUrl && (
                <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
              )}
            </div>
            <div className="flex flex-col items-start">
              <p className="tracking-[.05em] mb-2 text-3xl font-bold">
                {cafe.name}
              </p>
              <p>{"Toplam Değerlendirme: " + cafe.user_ratings_total}</p>
              <p>{"Puan: " + cafe.rating}</p>
              <p>
                {cafe.opening_hours?.open_now == true
                  ? "Çalışma Durumu : (Açık)"
                  : "Çalışma Durumu : (Kapalı)"}
              </p>
              <p>{"Adres: " + cafe.vicinity}</p>
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
              lat={cafe.geometry.location.lat}
              lng={cafe.geometry.location.lng}
              width="80%"
              height="400px"
            />
          </div>
        </div>
      ) : restaurant ? (
        <div className="flex flex-row py-8 px-4 justify-center mt-8 bg-white bg-opacity-80 rounded-lg w-2/3">
          <div className="flex flex-col justify-center items-start w-full  px-8 gap-4 rounded-lg">
            <div>
              {restaurant.photos && restaurant.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                  className="rounded-full object-cover h-52 w-52 cursor-pointer hover:scale-110"
                  alt={`${restaurant.name} Photo`}
                  onClick={() =>
                    restaurant.photos &&
                    restaurant.photos[0] &&
                    handleImageClick(
                      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${restaurant.photos[0]?.photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`
                    )
                  }
                />
              ) : (
                <img
                  src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
                  className="rounded-full object-cover h-40 w-40"
                  alt="Default Photo"
                />
              )}
              {modalImageUrl && (
                <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
              )}
            </div>
            <div className="flex flex-col items-start">
              <p className="tracking-[.05em] mb-2 text-3xl font-bold">
                {restaurant.name}
              </p>
              <p>{"Toplam Değerlendirme: " + restaurant.user_ratings_total}</p>
              <p>{"Puan: " + restaurant.rating}</p>
              <p>
                {restaurant.opening_hours?.open_now == true
                  ? "Çalışma Durumu : (Açık)"
                  : "Çalışma Durumu : (Kapalı)"}
              </p>
              <p>{"Adres: " + restaurant.vicinity}</p>
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
              lat={restaurant.geometry.location.lat}
              lng={restaurant.geometry.location.lng}
              width="80%"
              height="400px"
            />
          </div>
        </div>
      ) : library ? (
        <div className="flex flex-row py-8 px-4 justify-center mt-8 bg-white bg-opacity-80 rounded-lg w-2/3">
          <div className="flex flex-col justify-center items-start w-full  px-8 gap-4 rounded-lg">
            <div>
              {library.photos && library.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${library.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                  className="rounded-full object-cover h-52 w-52 cursor-pointer hover:scale-110"
                  alt={`${library.name} Photo`}
                  onClick={() =>
                    library.photos &&
                    library.photos[0] &&
                    handleImageClick(
                      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${library.photos[0]?.photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`
                    )
                  }
                />
              ) : (
                <img
                  src="https://pgsd.fip.hamzanwadi.ac.id/assets/upload/image/aa.png"
                  className="rounded-full object-cover h-40 w-40"
                  alt="Default Photo"
                />
              )}
              {modalImageUrl && (
                <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />
              )}
            </div>
            <div className="flex flex-col items-start">
              <p className="tracking-[.05em] mb-2 text-3xl font-bold">
                {library.name}
              </p>
              <p>{"Toplam Değerlendirme: " + library.user_ratings_total}</p>
              <p>{"Puan: " + library.rating}</p>
              <p>
                {library.opening_hours?.open_now == true
                  ? "Çalışma Durumu : (Açık)"
                  : "Çalışma Durumu : (Kapalı)"}
              </p>
              <p>{"Adres: " + library.vicinity}</p>
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
              lat={library.geometry.location.lat}
              lng={library.geometry.location.lng}
              width="80%"
              height="400px"
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
      <div className="flex flex-col py-4 items-center mt-8 justify-center bg-white bg-opacity-80 rounded-lg w-2/3">
        <p className="text-2xl font-bold ">DEĞERLENDİRMELER</p>
        <ul className="flex flex-col gap-4 w-3/4 mt-4">
          {comments.map((comment, index) => (
            <li
              className="w-full bg-white w-2/3 py-2 px-4 rounded-lg"
              key={index}
            >
              <p className="font-bold">{comment.username}</p>
              <p className="line-clamp-2 hover:line-clamp-none transition delay-150 duration-300 hover:delay-300">
                {comment.comment}
              </p>
              <p className="text-sm font-bold text-gray-500">
                Rating: {comment.rating}
              </p>
            </li>
          ))}
        </ul>

        <div id="form" className="mt-8 w-3/4 flex justify-center">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu buraya yazın..."
            className="border p-4 w-full rounded-lg"
          />
          <button
            onClick={handleSubmitComment}
            className="ml-2 px-4 bg-blue-500 w-2/5 text-white rounded"
          >
            Yorum Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
