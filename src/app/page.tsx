import { BookingProvider } from "@/components/booking/BookingContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Facts } from "@/components/sections/Facts";
import { Hero } from "@/components/sections/Hero";
import { MapSection } from "@/components/sections/MapSection";
import { Masters } from "@/components/sections/Masters";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Works } from "@/components/sections/Works";

/**
 * Порядок секций отличается от исходного ТЗ: работы и мастера стоят выше отзывов,
 * потому что мужчина, выбирающий барбершоп, боится одного — что его испортят.
 * Доказательство важнее преимуществ.
 *
 * `Reviews` остаётся серверным компонентом: он передан в `BookingProvider` как
 * children, а не отрендерен внутри клиентского модуля.
 */
export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <Hero />
        <Facts />
        <Services />
        <Works />
        <Masters />
        <Reviews />
        <MapSection />
      </main>
      <Footer />
    </BookingProvider>
  );
}
