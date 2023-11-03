"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/page";

interface Place {
  name: string;
  photos: string;
}

const Page: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/discover");
        console.log(response);

        const data = await response.data;
        setPlaces(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlaces([]);
      }
    };

    fetchData();
  }, []);

  if (places.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-between py-4">
      <Navbar />

      <div className="flex w-full justify-center flex-col items-center my-16 gap-4">
        {places.map((place, index) => (
          <div
            className="flex flex-row items-start bg-white w-2/3 py-10 px-8 gap-10 rounded-lg"
            key={index}
          >
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=API_KEY`}
              className="rounded-full object-cover h-40 w-40"
            ></img>
            <p className="my-4 font-bold">{place.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
