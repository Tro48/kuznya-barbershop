import { BookingProvider } from "@/components/booking/BookingContext";
import { Header } from "@/components/layout/Header";
import { Facts } from "@/components/sections/Facts";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <Hero />
        <Facts />
        <Services />
        <Works />
      </main>
    </BookingProvider>
  );
}
