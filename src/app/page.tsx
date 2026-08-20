import styles from "./page.module.css";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import TabBar from "@/components/chrome/TabBar";
import TodayBar from "@/components/home/TodayBar";
import FeatureCard from "@/components/home/FeatureCard";
import DayChips from "@/components/home/DayChips";
import PinCard from "@/components/home/PinCard";
import SectionBar from "@/components/home/SectionBar";
import Quiz from "@/components/home/Quiz";
import Sidebar from "@/components/home/Sidebar";
import VideoBand from "@/components/home/VideoBand";
import Manifesto from "@/components/home/Manifesto";
import ThreeMount from "@/components/three/ThreeMount";
import {
  getDigest, getDigestDayChips, getEvents, getFeatured, getMostPinned, getVideos, toCard,
} from "@/lib/content/accessors";
import type { DigestPinCard } from "@/lib/content/types";

export default function Home() {
  const digest = getDigest();
  const pins: DigestPinCard[] = digest.pins.map((pin) => ({ article: toCard(pin.article), lead: pin.lead }));

  return (
    <>
      <Header dateLabel={`${digest.dateLabel} · ${digest.weekdayLabel}`} />
      <section className={styles.hero}>
        <ThreeMount scene="ambient" className={styles.heroAmbient} />
        <div className="wrap">
          <TodayBar storyCount={digest.storyCount} totalMinutes={digest.totalMinutes} updatedAtLabel={digest.updatedAtLabel} />
          <FeatureCard article={toCard(getFeatured())} />
        </div>
      </section>

      <div className="wrap">
        <SectionBar title="Өдрийн пинүүд" meta={`${digest.pins.length} мэдээ · ${digest.pinListMinutes} минут`} />
        <DayChips chips={getDigestDayChips()} />
        <div className={styles.grid}>
          <main>
            {pins.map((pin, i) => {
              const num = pins.slice(0, i + 1).filter((p) => !p.article.sponsored).length;
              return <PinCard key={pin.article.slug} pin={pin} num={String(num).padStart(2, "0")} />;
            })}
          </main>
          <Sidebar events={getEvents()} mostPinned={getMostPinned()} />
        </div>
      </div>

      <div className="wrap">
        <Quiz />
      </div>

      <VideoBand videos={getVideos()} />
      <Manifesto />
      <Footer />
      <TabBar />
    </>
  );
}
