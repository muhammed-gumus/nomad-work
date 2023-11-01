"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Place {
  name: string;
  // Diğer özellikler
}

const Page: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/discover");
        console.log(response);

        const data = await response.data;
        setPlaces(data.results); // Veriyi doğrudan places'e atayın
      } catch (error) {
        console.error("Error fetching data:", error);
        setPlaces([]); // Hata durumunda boş bir diziyle güncelle
      }
    };

    fetchData();
  }, []);

  if (places.length === 0) {
    return <div>Loading...</div>; // Veri yüklenene kadar yükleme mesajı göster
  }

  return (
    <div>
      <h1>Yakındaki Restoranlar</h1>
      <div>
        {places.map((place, index) => (
          <p key={index}>{place.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Page;
