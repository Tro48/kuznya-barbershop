import Link from "next/link";
import { Container } from "./Container";
import { site, telHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-scale border-t">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.18em] uppercase">
              {site.name}
            </p>
            <p className="text-ash text-small mt-3">{site.slogan}</p>
          </div>

          <div>
            <h2 className="text-ash text-small tracking-wide uppercase">Контакты</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={telHref}
                  data-goal="phone_click"
                  className="hover:text-brass transition-colors duration-200"
                >
                  {site.phoneFormatted}
                </a>
              </li>
              <li className="text-ash text-small">
                {site.address.street}, {site.address.city}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-ash text-small tracking-wide uppercase">Мы в сети</h2>
            <ul className="mt-3 flex gap-4">
              {site.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    data-goal="messenger_click"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brass transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-scale text-ash text-small mt-12 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p>Демонстрационный проект. Компания и отзывы вымышлены.</p>
          <Link
            href="/privacy"
            className="hover:text-brass transition-colors duration-200"
          >
            Политика обработки персональных данных
          </Link>
        </div>
      </Container>
    </footer>
  );
}
