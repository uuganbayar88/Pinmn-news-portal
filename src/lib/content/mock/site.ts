import type { DailyDigest, EventItem, SearchEntry, VideoItem } from "../types";
import { articles, photos } from "./articles";

const bySlug = (slug: string) => {
  const a = articles.find((x) => x.slug === slug);
  if (!a) throw new Error(`mock article missing: ${slug}`);
  return a;
};

export const digests: DailyDigest[] = [
  {
    date: "2026-08-07",
    dateLabel: "08.07",
    weekdayLabel: "ПҮРЭВ",
    pins: [
      { article: bySlug("tov-bank-bodlogyn-huu"), lead: true },
      { article: bySlug("huuliin-tosluud-todorloo") },
      { article: bySlug("startup-horongo-oruulalt") },
      { article: bySlug("5g-suljee-biznes") },
      { article: bySlug("shine-avtobusny-chiglel") },
    ],
    // storyCount (8) tracks the mockup's editorial count for the day, which
    // is larger than the 5 pins actually rendered here — mockup-faithful, not a bug.
    storyCount: 8,
    totalMinutes: 7,
    pinListMinutes: 10,
    updatedAtLabel: "7:30-д шинэчлэв",
  },
];

export const dayChips = [
  { label: "Өнөөдөр · 08.07", date: "2026-08-07", active: true },
  { label: "Лх · 08.06", date: "2026-08-06", active: false, toast: "08.06-ны пинүүд (демо)" },
  { label: "Мя · 08.05", date: "2026-08-05", active: false, toast: "08.05-ны пинүүд (демо)" },
  { label: "Да · 08.04", date: "2026-08-04", active: false, toast: "08.04-ний пинүүд (демо)" },
];

export const relatedPins: { title: string; meta: string }[] = [
  { title: "Төв банк бодлогын хүүг хэвээр хадгалав", meta: "Эдийн засаг · 2 мин" },
  { title: "Цахим үйлчилгээний хуулийн товч тайлбар", meta: "Технологи · 3 мин" },
  { title: "ЖДБ-ийн зээлийн шинэ хөтөлбөр", meta: "Бизнес · 2 мин" },
];

export const events: EventItem[] = [
  { day: "04", monthLabel: "8 САР", title: "Startup Grind UB", venue: "Corporate Convention Centre" },
  { day: "09", monthLabel: "8 САР", title: "Хөх толбо — тоглолт", venue: "Үндэсний цэцэрлэгт хүрээлэн" },
  { day: "15", monthLabel: "8 САР", title: "Digital Forum 2026", venue: "Шангри-Ла төв" },
];

export const mostPinned = [
  "Татварын шинэчлэлийн бүрэн тайлбар",
  "УБ метроны төслийн явц — юу хүлээх вэ",
  "Хилийн боомтуудын шинэ горим",
  "Цалингийн дундаж өсөлт: салбараар",
];

export const videos: VideoItem[] = [
  { id: "v1", image: photos.downtown,  title: "«Монголын эдийн засгийн дараагийн 5 жил»", category: "Ярилцлага", duration: "12:40", meta: "Эдийн засагч зочинтой · 24К үзэлт · Өчигдөр", size: "big", palette: 0, delay: 0 },
  { id: "v2", image: photos.palace,  title: "Татварын шинэчлэл — 3 минутад", category: "Тайлбарлая", duration: "3:05", meta: "18К үзэлт", size: "small", palette: 1, delay: 1 },
  { id: "v3", image: photos.constr,  title: "Метроны талбайд: явц ямар байна?", category: "Репортаж", duration: "6:22", meta: "31К үзэлт", size: "small", palette: 2, delay: 1 },
  { id: "v4", image: photos.traffic,  title: "Өнөөдрийн пин — 90 секундэд", category: "Shorts", duration: "1:48", meta: "Өдөр бүр", size: "small", palette: 3, delay: 2 },
  { id: "v5", image: photos.bus,  title: "Шинэ автобусаар нэг өдөр", category: "Хотын амьдрал", duration: "8:15", meta: "9К үзэлт", size: "small", palette: 4, delay: 2 },
];

export const searchIndex: SearchEntry[] = [
  { category: "Эдийн засаг", title: "Төв банк бодлогын хүүг хэвээр хадгалав", date: "08.07", slug: "tov-bank-bodlogyn-huu" },
  { category: "Улс төр", title: "Намрын чуулганаар хэлэлцэх хуулийн төслүүд тодорлоо", date: "08.07", slug: "huuliin-tosluud-todorloo" },
  { category: "Технологи", title: "Монгол стартап бүс нутгийн хөрөнгө оруулалт татлаа", date: "08.07", slug: "startup-horongo-oruulalt" },
  { category: "Хот", title: "Шинэ автобусны чиглэлүүд өнөөдрөөс хэрэгжинэ", date: "08.07", slug: "shine-avtobusny-chiglel" },
  { category: "Улс төр", title: "Татварын шинэчлэл юуг өөрчлөх вэ? — бүрэн тайлбар", date: "08.06", slug: "tatvaryn-shinechlel" },
  { category: "Хот", title: "УБ метроны төслийн явц — юу хүлээх вэ", date: "08.05" },
  { category: "Эдийн засаг", title: "Цалингийн дундаж өсөлт: салбараар", date: "08.04" },
  { category: "Нийгэм", title: "Хилийн боомтуудын шинэ горим", date: "08.04" },
];
