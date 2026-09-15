import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty-state">
      <span className="eyebrow">404 / ОЛДСОНГҮЙ</span>
      <h1>Энэ хуудас олдсонгүй.</h1>
      <p>Холбоосыг шалгах эсвэл мэдээг хайж үзээрэй.</p>
      <Link className="button" href="/search">
        Мэдээ хайх
      </Link>
    </div>
  );
}
