'use client';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="empty-state" role="alert">
      <h1>Мэдээг ачаалж чадсангүй.</h1>
      <p>Түр хүлээгээд дахин оролдоно уу.</p>
      <button className="button" onClick={reset}>
        Дахин оролдох
      </button>
    </div>
  );
}
