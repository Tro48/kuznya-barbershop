export function BookingSuccess({ name }: { name: string }) {
  return (
    <div
      className="border-brass bg-anvil rounded-sm border p-8 md:p-12"
      role="status"
      aria-live="polite"
    >
      <p className="text-brass text-small tracking-[0.2em] uppercase">Заявка принята</p>

      <h3 className="text-h2 mt-4 uppercase">{name}, записали</h3>

      {/* Текст говорит, что будет дальше: это снимает тревогу и повторные заявки. */}
      <p className="text-ash mt-6 max-w-md">
        Перезвоним в течение пятнадцати минут и подтвердим время. Если сейчас ночь —
        утром, как откроемся.
      </p>

      <p className="text-ash text-small mt-4 max-w-md">
        Ничего делать не нужно. Если передумаете — скажете администратору по телефону.
      </p>
    </div>
  );
}
