import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar/page";
import Banner from "./Banner/page";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between py-4">
      <Navbar/>
      <Banner/>
      <Link href={"/user"}>mami</Link>
    </main>
  );
}
