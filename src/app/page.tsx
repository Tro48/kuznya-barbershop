import { BookingProvider } from "@/components/booking/BookingContext";
import { Header } from "@/components/layout/Header";
import { Facts } from "@/components/sections/Facts";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <Hero />
        <Facts />
      </main>
    </BookingProvider>
  );
}
