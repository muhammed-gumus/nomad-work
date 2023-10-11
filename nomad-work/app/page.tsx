import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <Navbar/>
    </main>
  );
}
