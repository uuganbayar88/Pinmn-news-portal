import Link from 'next/link';
export const metadata = { title: 'Бидний тухай' };
export default function About() {
  return (
    <article className="prose-page">
      <span className="eyebrow">PIN / БИДНИЙ ТУХАЙ</span>
      <h1>
        Олон мэдээнээс,
        <br />
        чухлыг нь.
      </h1>
      <p>
        pin.mn бол чухал мэдээг сонгож, гол санааг нь ойлгомжтой тайлбарлан хүргэх Монголын мэдээний
        портал.
      </p>
      <h2>Таны цаг үнэтэй.</h2>
      <p>
        Мэдээ бүрийг товч тайлбар, гол баримт, эх сурвалжийн холбоостойгоор хүргэнэ. Та голыг нь
        ойлгоод, сонирхвол эх сурвалжаас дэлгэрүүлэн уншиж болно.
      </p>
      <h2>Өдөр бүрийн пин</h2>
      <p>Өдрийн тойм нь 7–10 мэдээг нэг дор унших боломж олгоно.</p>
      <Link className="button" href="/daily">
        Өдрийн тойм унших →
      </Link>
    </article>
  );
}
