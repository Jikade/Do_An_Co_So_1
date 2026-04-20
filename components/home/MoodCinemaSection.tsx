"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Play } from "lucide-react";
import { SlidingPillTabs } from "@/components/common/sliding-pill-tabs";

type MoodKey = "all" | "keep" | "soft" | "light" | "push" | "night";

type Track = {
  id: string;
  title: string;
  artist: string;
  tag: string;
  mood: Exclude<MoodKey, "all">;
  cover: string;
  reason: string;
};

const MOODS: Array<{ key: MoodKey; label: string }> = [
  { key: "all", label: "Tat ca" },
  { key: "keep", label: "Giu mood" },
  { key: "soft", label: "Doi mood" },
  { key: "light", label: "Vi nhe" },
  { key: "push", label: "Day mood" },
  { key: "night", label: "Dem nay" },
];

const TRACKS: Track[] = [
  {
    id: "1",
    title: "As If It's Your Last",
    artist: "BLACKPINK",
    tag: "K-pop",
    mood: "keep",
    cover: "/img/as-if-your.png",
    reason: "Giu truc pop sang va quen tai cho phien nay.",
  },
  {
    id: "2",
    title: "GO",
    artist: "BLACKPINK",
    tag: "Pop energy",
    mood: "keep",
    cover: "/img/go.png",
    reason: "Giu nhip tuoi nhung gon va bat mat hon.",
  },
  {
    id: "3",
    title: "Anh Vui",
    artist: "Pham Ky",
    tag: "V-pop",
    mood: "soft",
    cover: "/img/anhvui.png",
    reason: "Doi mau nghe nhe ma khong roi khoi mood hien tai.",
  },
  {
    id: "4",
    title: "How You Like That",
    artist: "BLACKPINK",
    tag: "Hype",
    mood: "push",
    cover: "/img/how-you-like.png",
    reason: "Tang luc hinh va nang luong de keo mood len nhanh.",
  },
  {
    id: "5",
    title: "DREAM",
    artist: "LISA ft. Kentaro Sakaguchi",
    tag: "Ballad",
    mood: "light",
    cover: "/img/dream.png",
    reason: "Lam khong khi mem hon, sang hon va thoang hon.",
  },
  {
    id: "6",
    title: "Mot Trieu Kha Nang",
    artist: "Truong Ham Van",
    tag: "Chill",
    mood: "light",
    cover: "/img/mot-trieu-kha-nang.png",
    reason: "Diu khong gian nghe va mo mat hinh ra thoang hon.",
  },
  {
    id: "7",
    title: "Chiu Cach Minh Noi Thua",
    artist: "RHYDER",
    tag: "Late night",
    mood: "night",
    cover: "/img/chiu-cach-minh.png",
    reason: "Keo mood ve phia dem, gan va tram hon.",
  },
  {
    id: "8",
    title: "Yeu La Tha Thu",
    artist: "Only C",
    tag: "Soft pop",
    mood: "soft",
    cover: "/img/yeu-la-tha-thu.png",
    reason: "Chuyen tu gat sang em ma van giu duoc do bat tai.",
  },
  {
    id: "9",
    title: "Nhung Loi Hua Bo Quen",
    artist: "Vu. x Dear Jane",
    tag: "Night ballad",
    mood: "night",
    cover: "/img/nhung-loi-hua-bo-quen.png",
    reason: "Dam chat khuya hon, hop khi muon nghe cham lai.",
  },
  {
    id: "10",
    title: "LAVIAI",
    artist: "WXRDIE ft. HIEUTHUHAI, 2PILLZ",
    tag: "Rap-pop",
    mood: "push",
    cover: "/img/laviai.png",
    reason: "Day nhiet do nghe len bang mot mau ca tinh hon.",
  },
  {
    id: "11",
    title: "Glory Glory Man United",
    artist: "Man United F.C.",
    tag: "Anthem",
    mood: "keep",
    cover: "/img/gorly-gorly.png",
    reason: "Giu cam giac lon va dong, hop luc can them hung phan.",
  },
  {
    id: "12",
    title: "Bai Hat Nay",
    artist: "Unknown Session",
    tag: "Easy listen",
    mood: "light",
    cover: "/img/bai-hat-nay.png",
    reason: "Nhe, de vao va du sang de mo rong phan kham pha.",
  },
];

const chipClass =
  "inline-flex items-center rounded-full border border-white/12 bg-black/28 px-3 py-1.5 text-[11px] font-medium text-white/78 backdrop-blur-md";
const secondaryButtonClass =
  "inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/72 transition hover:border-white/18 hover:bg-white/[0.06] hover:text-white";
const playButtonClass =
  "inline-flex h-13 items-center gap-2 rounded-full bg-[var(--brand-accent)] px-5 text-sm font-semibold text-[#041009] shadow-[0_14px_34px_rgba(30,215,96,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(30,215,96,0.2)]";

function buildView(activeMood: MoodKey) {
  const prioritized =
    activeMood === "all"
      ? TRACKS
      : [
          ...TRACKS.filter((track) => track.mood === activeMood),
          ...TRACKS.filter((track) => track.mood !== activeMood),
        ];

  return {
    hero: prioritized[0],
    lanes: prioritized.slice(1, 4),
    grid: prioritized.slice(4, 12),
  };
}

export default function MoodCinemaSection() {
  const [activeMood, setActiveMood] = useState<MoodKey>("keep");
  const { hero, lanes, grid } = useMemo(() => buildView(activeMood), [activeMood]);

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,14,18,0.96),rgba(7,9,12,0.98))] px-6 py-6 shadow-[0_34px_120px_rgba(0,0,0,0.44)] md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_16%,transparent_84%,rgba(0,0,0,0.18))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_3px)]" />

      <div className="relative space-y-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/36">
              Rap cam xuc
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-[2.45rem]">
              Xem video theo mood cua cau
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-white/56 md:text-base">
              Poster ro hon, text gon hon, va toan bo khu kham pha nay thay doi theo
              mood ma khong con bi mot lop man hinh toi de len.
            </p>
          </div>

          <button className={secondaryButtonClass}>
            <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
            Chon huong nghe
          </button>
        </div>

        <SlidingPillTabs
          items={MOODS.map((mood) => ({ id: mood.key, label: mood.label }))}
          activeKey={activeMood}
          onChange={setActiveMood}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.72fr)_minmax(320px,0.88fr)]">
          <article className="group relative min-h-[470px] overflow-hidden rounded-[30px] border border-white/10 bg-[#05070a] shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
            <img
              src={hero.cover}
              alt={hero.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#05070a] via-[#05070a]/26 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className={`${chipClass} text-emerald-300`}>
                  MOOD: {MOODS.find((mood) => mood.key === activeMood)?.label ?? "Tat ca"}
                </span>
                <span className={chipClass}>{hero.tag}</span>
              </div>

              <div className="max-w-[28rem] space-y-3 text-white">
                <h3 className="line-clamp-2 text-3xl font-semibold tracking-tight drop-shadow-[0_12px_26px_rgba(0,0,0,0.36)] md:text-[3.3rem] md:leading-[1.02]">
                  {hero.title}
                </h3>
                <p className="text-base text-white/74 md:text-lg">{hero.artist}</p>
                <p className="line-clamp-2 max-w-[24rem] text-sm leading-6 text-white/62 md:text-base">
                  {hero.reason}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className={chipClass}>{hero.tag}</span>
                  <button className={playButtonClass}>
                    <Play className="h-4 w-4 fill-current" />
                    Phat
                  </button>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/34">
                  Chon huong cam xuc
                </p>
                <p className="mt-2 text-sm leading-6 text-white/54">
                  Card ben phai doi theo mood dang bam, giu nhan nhanh va ro hon.
                </p>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/42 md:inline-flex">
                3 pick
              </span>
            </div>

            <div className="space-y-4">
              {lanes.map((track, index) => (
                <article
                  key={track.id}
                  className={[
                    "group grid min-h-[138px] grid-cols-[128px_1fr_auto] gap-4 overflow-hidden rounded-[24px] border p-3 transition-all duration-300",
                    index === 0
                      ? "border-[var(--brand-accent)]/16 bg-white/[0.05] shadow-[0_0_0_1px_rgba(30,215,96,0.05),0_18px_52px_rgba(0,0,0,0.24)]"
                      : "border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <div className="relative overflow-hidden rounded-[18px] bg-[#06080b]">
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#05070a] via-[#05070a]/22 to-transparent" />
                  </div>

                  <div className="min-w-0 self-center space-y-2">
                    <p className="line-clamp-1 text-lg font-semibold text-white md:text-xl">
                      {track.title}
                    </p>
                    <p className="line-clamp-1 text-sm text-white/60">{track.artist}</p>
                    <span className={chipClass}>{track.tag}</span>
                    <p className="line-clamp-2 text-sm leading-6 text-white/52">
                      {track.reason}
                    </p>
                  </div>

                  <button className="self-center rounded-full border border-white/10 bg-white/[0.04] p-3 text-white/74 transition hover:border-[var(--brand-accent)]/28 hover:bg-[var(--brand-accent)]/12 hover:text-emerald-300">
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">
                Kham pha them
              </h3>
              <p className="mt-1 text-sm leading-6 text-white/54">
                Poster lon hon, chip gon hon, hover sach hon.
              </p>
            </div>
            <button className={secondaryButtonClass}>
              Xem tat ca
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {grid.map((track) => (
              <article
                key={track.id}
                className="group overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#05070a]">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#05070a] via-[#05070a]/16 to-transparent" />
                  <button className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/36 p-3 text-white/88 backdrop-blur-sm transition group-hover:scale-[1.05] group-hover:border-[var(--brand-accent)]/25 group-hover:bg-[var(--brand-accent)]/12 group-hover:text-emerald-300">
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </div>

                <div className="space-y-2 px-4 pb-4 pt-3">
                  <p className="line-clamp-1 text-xl font-semibold tracking-tight text-white">
                    {track.title}
                  </p>
                  <p className="line-clamp-1 text-sm text-white/58">{track.artist}</p>
                  <span className={chipClass}>{track.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
