"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { masters } from "@/content/masters";
import { services } from "@/content/services";
import { reachGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { applyPhoneEdit, formatPhone, normalizePhone } from "@/lib/phone";
import {
  ANY_MASTER,
  leadSchema,
  preferredTimeLabels,
  preferredTimes,
  type LeadInput,
} from "@/lib/schemas/lead";
import { site, telHref } from "@/lib/site";
import { BOOKING_ANCHOR, useBooking } from "./BookingContext";
import { BookingSuccess } from "./BookingSuccess";

type SubmitState = "idle" | "error";

export function BookingForm() {
  const { request } = useBooking();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [successName, setSuccessName] = useState<string | null>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);

  /**
   * Время отрисовки формы для time-trap. Ставится в эффекте, а не во время рендера:
   * `Date.now()` на сервере не совпал бы с клиентским и уронил бы гидрацию.
   * В скрытое поле не пишем — боту это значение знать незачем.
   */
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      master: ANY_MASTER,
      comment: "",
      website: "",
      renderedAt: 0,
    },
    mode: "onTouched",
  });

  // useWatch, а не watch(): watch() возвращает функцию, которую нельзя мемоизировать.
  const phone = useWatch({ control, name: "phone" });
  const preferredTime = useWatch({ control, name: "preferredTime" });

  // Клик по «Записаться» в карточке услуги или мастера. nonce — чтобы повторный
  // клик по той же карточке снова навёл фокус, а не был проигнорирован.
  useEffect(() => {
    if (!request) return;

    if (request.values.service) setValue("service", request.values.service);
    if (request.values.master) setValue("master", request.values.master);

    // preventScroll: страница уже едет к форме, второй скролл дёргает её.
    serviceRef.current?.focus({ preventScroll: true });
  }, [request, setValue]);

  /**
   * `disabled` на кнопке появляется только после ререндера, а два клика мыши
   * успевают пройти раньше. Защёлка отсекает их синхронно; сервер дублирует
   * защиту дедупликацией по (телефон, услуга, минута).
   */
  const inFlight = useRef(false);

  async function submitLead(values: LeadInput, renderedAtMs: number) {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitState("idle");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone: normalizePhone(values.phone),
          renderedAt: renderedAtMs,
        }),
      });

      if (!response.ok) {
        setSubmitState("error");
        return;
      }

      // Цель — только после успешного ответа сервера, не по клику на кнопку.
      reachGoal("form_submit_success");
      setSuccessName(values.name);
    } catch {
      setSubmitState("error");
    } finally {
      inFlight.current = false;
    }
  }

  const { ref: serviceFieldRef, ...serviceField } = register("service");

  return (
    <Section
      id={BOOKING_ANCHOR}
      index="06"
      title="Записаться"
      lead="Оставьте телефон — администратор перезвонит и подтвердит время. Заявка уходит мастеру в Telegram за секунду."
    >
      {successName ? (
        <BookingSuccess name={successName} />
      ) : (
        <form
          noValidate
          // handleSubmit собирается в обработчике, а не в рендере: иначе колбэк
          // читает ref во время рендера.
          onSubmit={(event) =>
            void handleSubmit((values) => submitLead(values, renderedAt.current))(event)
          }
          className="border-scale bg-anvil grid gap-6 rounded-sm border p-6 md:grid-cols-2 md:p-10"
        >
          <Input
            label="Имя"
            required
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

          {/*
            В состоянии формы номер лежит нормализованным (`+79991234567`) — его же
            видит Zod и получает сервер. Человеку показываем `+7 (999) 123-45-67`.
          */}
          <Input
            label="Телефон"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
            error={errors.phone?.message}
            {...register("phone")}
            value={formatPhone(phone)}
            onChange={(event) =>
              setValue(
                "phone",
                normalizePhone(applyPhoneEdit(formatPhone(phone), event.target.value)),
                { shouldValidate: Boolean(errors.phone) },
              )
            }
          />

          <Select
            label="Услуга"
            required
            error={errors.service?.message}
            {...serviceField}
            ref={(node) => {
              serviceFieldRef(node);
              serviceRef.current = node;
            }}
          >
            <option value="" disabled>
              Выберите услугу
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </Select>

          <Select label="Мастер" error={errors.master?.message} {...register("master")}>
            <option value={ANY_MASTER}>Не важно</option>
            {masters.map((master) => (
              <option key={master.slug} value={master.slug}>
                {master.name} — {master.specialization.toLowerCase()}
              </option>
            ))}
          </Select>

          <fieldset className="md:col-span-2">
            <legend className="text-small text-ash mb-2 tracking-wide uppercase">
              Удобное время
            </legend>
            <div className="flex flex-wrap gap-2">
              {preferredTimes.map((slot) => {
                const active = preferredTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setValue("preferredTime", active ? undefined : slot, {
                        shouldValidate: false,
                      })
                    }
                    className={cn(
                      "text-small rounded-sm border px-5 py-2 tracking-wide transition-colors duration-200",
                      active
                        ? "border-brass text-brass"
                        : "border-scale text-ash hover:border-ash hover:text-chalk",
                    )}
                  >
                    {preferredTimeLabels[slot]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Textarea
            label="Комментарий"
            className="md:col-span-2"
            hint="Например: «стригусь коротко, виски в ноль»."
            error={errors.comment?.message}
            {...register("comment")}
          />

          {/* Honeypot: не display:none — часть ботов пропускает такие поля. */}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Не заполняйте это поле</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <div className="md:col-span-2">
            <Checkbox
              label={
                <>
                  Согласен на обработку персональных данных в соответствии с{" "}
                  <Link href="/privacy" className="text-chalk hover:text-brass underline">
                    политикой
                  </Link>
                  .
                </>
              }
              error={errors.consent?.message}
              {...register("consent")}
            />
          </div>

          <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
            <Button type="submit" pending={isSubmitting} className="md:w-56">
              {isSubmitting ? "Отправляем" : "Отправить заявку"}
            </Button>

            {submitState === "error" ? (
              <p role="alert" className="text-danger text-small">
                Не смогли принять заявку. Позвоните нам —{" "}
                <a href={telHref} className="underline">
                  {site.phoneFormatted}
                </a>
                , ответим сразу.
              </p>
            ) : (
              <p className="text-ash text-small">
                Перезвоним в течение пятнадцати минут.
              </p>
            )}
          </div>
        </form>
      )}
    </Section>
  );
}
