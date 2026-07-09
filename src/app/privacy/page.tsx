import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Кто обрабатывает данные",
    body: `Оператор — ${site.legalName}, ${site.address.street}, ${site.address.city}. Это демонстрационный проект: компания вымышлена, реальной обработки персональных данных не происходит.`,
  },
  {
    title: "2. Какие данные собираются",
    body: "Имя, номер телефона и — при желании — комментарий, выбранная услуга, мастер и удобное время. Иных данных форма не запрашивает.",
  },
  {
    title: "3. Зачем",
    body: "Единственная цель — связаться с вами и подтвердить запись. Данные не передаются третьим лицам, не используются для рассылок и не продаются.",
  },
  {
    title: "4. Основание",
    body: "Согласие субъекта персональных данных, которое даётся отметкой чекбокса в форме записи. Чекбокс не предустановлен: без него форма не отправляется.",
  },
  {
    title: "5. Сколько хранятся",
    body: "До достижения цели обработки — то есть до подтверждения записи и оказания услуги. Заявка приходит администратору в Telegram; резервная копия — в базе данных, к которой нет анонимного доступа.",
  },
  {
    title: "6. Как отозвать согласие",
    body: `Достаточно позвонить по телефону ${site.phoneFormatted} или написать на ${site.email}. Данные удаляются в течение суток.`,
  },
  {
    title: "7. Права субъекта",
    body: "Вы вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или уничтожения, а также обжаловать действия оператора в Роскомнадзоре.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="py-section">
      <Container>
        {/* Своя ширина вложенным блоком: класс на Container конфликтовал бы с его
            собственным max-width, и кто победит — решал бы порядок правил в CSS. */}
        <div className="max-w-3xl">
          <Link
            href="/"
            className="text-ash hover:text-brass text-small transition-colors duration-200"
          >
            ← На главную
          </Link>

          <h1 className="text-h2 mt-8 uppercase">
            Политика обработки персональных данных
          </h1>

          <p className="text-ash text-small mt-6">
            Демонстрационный проект. Компания «{site.name}», мастера, цены и отзывы
            вымышлены. Текст ниже — образец, а не юридический документ действующего
            бизнеса.
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-h3 uppercase">{section.title}</h2>
                <p className="text-ash mt-3">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
