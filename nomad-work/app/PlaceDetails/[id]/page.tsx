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


const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = params;

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [library, setLibrary] = useState<Library | null>(null);

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

  return (
    <div className="flex flex-col items-center py-4">
      <Navbar />
      {cafe ?(
        <div className="flex flex-col w-full mt-8">
          <div className="flex flex-row-reverse items-center justify-center w-full gap-24 ">
            <div>
              {cafe.photos && cafe.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${cafe.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                  className="object-cover"
                  alt={`${cafe.name} Photo`}
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
              <p className="text-2xl font-bold">{"İsim: " + cafe.name}</p>
              <p>{"Toplam Değerlendirme: " + cafe.user_ratings_total}</p>
              <p>{"Puan: " + cafe.rating}</p>
              <p>
                {cafe.opening_hours?.open_now == true
                  ? "Çalışma Durumu : (Açık)"
                  : "Çalışma Durumu : (Kapalı)"}
              </p>
              <p>{cafe.vicinity}</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center mt-8">
          <Map
            lat={cafe.geometry.location.lat}
            lng={cafe.geometry.location.lng}
            width="70%"
            height="400px"
          />
          </div>
        </div>
      ): restaurant ? (
        <div className="flex flex-col w-full mt-8">
          <div className="flex flex-row-reverse items-center justify-center w-full gap-24 ">
            <div>
              {restaurant.photos && restaurant.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                  className="object-cover"
                  alt={`${restaurant.name} Photo`}
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
              <p className="text-2xl font-bold">{"İsim: " + restaurant.name}</p>
              <p>{"Toplam Değerlendirme: " + restaurant.user_ratings_total}</p>
              <p>{"Puan: " + restaurant.rating}</p>
              <p>
                {restaurant.opening_hours?.open_now == true
                  ? "Çalışma Durumu : (Açık)"
                  : "Çalışma Durumu : (Kapalı)"}
              </p>
              <p>{restaurant.vicinity}</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center mt-8">
          <Map
            lat={restaurant.geometry.location.lat}
            lng={restaurant.geometry.location.lng}
            width="70%"
            height="400px"
          />
          </div>
        </div>
      ) : (
        library ? (
          <div className="flex flex-col w-full mt-8">
            <div className="flex flex-row-reverse items-center justify-center w-full gap-24 ">
              <div>
                {library.photos && library.photos.length > 0 ? (
                  <img
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${library.photos[0].photo_reference}&key=AIzaSyB--nWp1tPUs48E0zPePM7eLeS4c9Ny9JE`}
                    className="object-cover"
                    alt={`${library.name} Photo`}
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
                <p className="text-2xl font-bold">{"İsim: " + library.name}</p>
                <p>{"Toplam Değerlendirme: " + library.user_ratings_total}</p>
                <p>{"Puan: " + library.rating}</p>
                <p>
                  {library.opening_hours?.open_now == true
                    ? "Çalışma Durumu : (Açık)"
                    : "Çalışma Durumu : (Kapalı)"}
                </p>
                <p>{library.vicinity}</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center mt-8">
            <Map
              lat={library.geometry.location.lat}
              lng={library.geometry.location.lng}
              width="70%"
              height="400px"
            />
            </div>
          </div>
        ) : (<p>no result</p>)
      )}
    </div>
  );
};

export default Page;
