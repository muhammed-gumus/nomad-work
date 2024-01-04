import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between py-4">
      <Banner/>
    </main>
  );
}
