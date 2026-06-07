import { createResource, createSignal, For, Show } from "solid-js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { scrollTo } from "@/components/Navbar";
import "./styles.css";
import UploadedFiles from "./uploaded-files";
import { getHomepage } from "~/components/Home/home-quiries";
import { Testimonial } from "./home-types";

// ─── Constants ────────────────────────────────────────────────────────────────

const AMAZON_URL =
  "https://www.amazon.com/Electronic-Circuits-Fundamentals-Mathcad-Examples/dp/B0CJKL2N47/";
const TOC_PDF_URL =
  "https://ambitious-reward-466c838693.media.strapiapp.com/Electronic_Circuits_TOC_55a9670cb1.pdf";

const SHARE_BASE = "https://electronic-circuits.com/download-book/";
const SOCIAL_LINKS: { label: string; href: string }[] = [
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_BASE)}`,
  },
  {
    label: "Twitter / X",
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_BASE)}`,
  },
  {
    label: "LinkedIn",
    href: `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(SHARE_BASE)}`,
  },
  {
    label: "WhatsApp",
    href: `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_BASE)}`,
  },
];

// ─── Static data ──────────────────────────────────────────────────────────────

const KEY_FEATURES_LEFT: string[] = [
  "Concentrate on underlying principle and the logic behind the topic studied.",
  "Present important and fundamental topics in a simple way.",
  "Theory presented in compact form with all necessary information for student understanding.",
  "Examples given show all steps.",
  "Theory is discussed through examples (most of the time).",
];

const KEY_FEATURES_RIGHT: string[] = [
  "Many examples are provided (a total of 82).",
  "Several Mathcad examples are given.",
  "Students will understand the operation of electronic circuits and small systems.",
  "They will also be able to design simple circuits.",
  "Inexpensive book that is affordable by students around the world.",
  "Mathcad programs are found on the website, available for download.",
];

const INFO_CARDS: { icon: string; title: string; body: string }[] = [
  {
    icon: "🧠",
    title: "Teaching Philosophy",
    body: "Students should know the underlying principle and logic behind every topic — made simple and easy to apply. By mastering fundamental concepts, students develop the confidence to tackle any new problem or situation.",
  },
  {
    icon: "🎓",
    title: "Audience",
    body: "Intended for undergraduate Electrical & Electronic Engineering programs. Can be used as a primary text, a compact review for a second electronics course, or for programs requiring a single electronics course.",
  },
  {
    icon: "📐",
    title: "Pre-requisites",
    body: "Foundational knowledge in 1st-year calculus and basic circuit theory is expected to effectively grasp the concepts presented throughout the book.",
  },
  {
    icon: "📡",
    title: "Book Coverage",
    body: "Covers theory and applications of BJT, MOSFET, and Op-amp as active devices — nine chapters from bipolar junction transistors through fundamentals of feedback and oscillators.",
  },
];

const AUTHOR_CREDENTIALS: { icon: string; text: string }[] = [
  { icon: "🎓", text: "M.Sc. Digital Communications — University of Kent, UK" },
  { icon: "🎓", text: "Ph.D. Communications — University of Manchester, UK" },
  {
    icon: "🏛️",
    text: "Visiting Scientist — University of Victoria, Canada & Purdue University, USA",
  },
  { icon: "📄", text: "40+ published journal and conference papers" },
  {
    icon: "💡",
    text: "3 patents specialising in electronics for digital communications",
  },
  {
    icon: "🔬",
    text: "Reviewer for IET, IEEE PACRIM, and other international journals",
  },
  { icon: "🏅", text: "Chartered Engineer & Member of IET (UK)" },
];

const CHAPTERS: {
  num: string;
  title: string;
  figures: number;
  examples: number;
  pages: number;
}[] = [
  {
    num: "1",
    title: "Bipolar Junction Transistor (BJT)",
    figures: 58,
    examples: 16,
    pages: 70,
  },
  {
    num: "2",
    title: "Field Effect Transistor (FET)",
    figures: 41,
    examples: 12,
    pages: 48,
  },
  {
    num: "3",
    title: "Multi-stage Amplifiers",
    figures: 41,
    examples: 12,
    pages: 32,
  },
  {
    num: "4",
    title: "Basic Building Blocks for Integrated Circuit Amplifiers",
    figures: 44,
    examples: 8,
    pages: 36,
  },
  {
    num: "5",
    title: "Differential Amplifiers",
    figures: 24,
    examples: 6,
    pages: 25,
  },
  { num: "6", title: "Op-amp", figures: 23, examples: 4, pages: 19 },
  { num: "7", title: "Power Amp", figures: 27, examples: 5, pages: 23 },
  { num: "8", title: "Freq Response", figures: 43, examples: 6, pages: 28 },
  { num: "9", title: "FB", figures: 33, examples: 15, pages: 58 },
  { num: "Appendices", title: "", figures: 0, examples: 0, pages: 32 },
  { num: "Bibliography", title: "", figures: 0, examples: 0, pages: 1 },
  { num: "Index", title: "", figures: 0, examples: 0, pages: 3 },
];

const TOTALS = {
  figures: CHAPTERS.reduce((s, c) => s + c.figures, 0),
  examples: CHAPTERS.reduce((s, c) => s + c.examples, 0),
  pages: CHAPTERS.reduce((s, c) => s + c.pages, 0),
};

const STAT_PILLS: { value: string; label: string }[] = [
  { value: "337", label: "Figures" },
  { value: "86", label: "Examples" },
  { value: "375", label: "Pages" },
  { value: "9", label: "Chapters" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get initials from a name, e.g. "Lala Popo" → "LP" */
function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Pick up to `n` random items from an array (deterministic shuffle via sort). */
function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars(props: { count: number }) {
  return (
    <div class="flex gap-0.5" style="color: var(--magenta)">
      <For each={Array(props.count).fill(0)}>{() => <span>★</span>}</For>
    </div>
  );
}

function SectionLabel(props: { children: string }) {
  return (
    <span
      class="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
      style="color: var(--magenta)"
    >
      {props.children}
    </span>
  );
}

function MagentaBtn(props: {
  href?: string;
  onClick?: () => void;
  class?: string;
  children: string;
  size?: "sm" | "lg";
}) {
  const btnClass = `font-bold text-white ${props.class ?? ""}`;
  const style = "background: var(--magenta); border: none;";
  const hover = (e: MouseEvent & { currentTarget: HTMLElement }) =>
    (e.currentTarget.style.background = "#e63d7a");
  const leave = (e: MouseEvent & { currentTarget: HTMLElement }) =>
    (e.currentTarget.style.background = "var(--magenta)");

  if (props.href) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        <Button
          size={props.size}
          class={btnClass}
          style={style}
          onMouseEnter={hover}
          onMouseLeave={leave}
        >
          {props.children}
        </Button>
      </a>
    );
  }
  return (
    <Button
      size={props.size}
      class={btnClass}
      style={style}
      onMouseEnter={hover}
      onMouseLeave={leave}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

const COL_GRID = "grid-template-columns: 110px 1fr 130px 140px 120px;";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookLanding() {
  const [formSent, setFormSent] = createSignal(false);
  const [contactName, setContactName] = createSignal("");
  const [contactEmail, setContactEmail] = createSignal("");
  const [contactMsg, setContactMsg] = createSignal("");
  const [homePageData] = createResource(getHomepage);

  const handleContactSubmit = (e: Event) => {
    e.preventDefault();
    setFormSent(true);
  };

  // Pick up to 3 random testimonials from Strapi data; fall back to empty array
  const displayedTestimonials = () =>
    pickRandom(
      (homePageData()?.testimonials as Testimonial[]) ??
        ([] as unknown as Testimonial),
      3,
    );

  return (
    <div
      class="text-slate-100 font-sans min-h-screen antialiased"
      style="background: #0b0f1f"
    >
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section class="hero-glow relative overflow-hidden pt-24 pb-28 px-6">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl md:text-6xl leading-tight mb-6">
              {homePageData()?.heroTitle}
              <br />
              <span class="gradient-text italic">
                {homePageData()?.heroSubtitle}
              </span>
            </h1>
            <p class="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
              {homePageData()?.description}
            </p>
            <div class="flex flex-wrap gap-3">
              <MagentaBtn size="lg" onClick={() => scrollTo("#buy")}>
                Get the Book
              </MagentaBtn>
            </div>
          </div>

          <div class="flex justify-center">
            <img
              src={homePageData()?.heroPicture.url ?? ""}
              alt="Book cover"
              class="max-w-xs w-full"
            />
          </div>
        </div>
      </section>

      {/* ── About the Book ─────────────────────────────────────────────────── */}
      <section id="about" class="py-24 px-6" style="background: #0e101a">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>About The Book</SectionLabel>
            <h2
              class="text-4xl md:text-5xl mb-6"
              style="font-family:'Playfair Display',serif"
            >
              Built for <span class="gradient-text italic">engineers</span>
            </h2>
            <p class="text-slate-400 leading-relaxed mb-4">
              Electronic Circuits Fundamentals was developed while teaching
              Electronics for several years for students in Electrical and
              Electronic engineering undergraduate programs.
            </p>
            <p class="text-slate-400 leading-relaxed mb-8">
              This book deals with the theory and applications of BJT, MOSFET
              and Op-amp as active devices. Nine chapters from bipolar junction
              transistors through fundamentals of feedback and oscillators.
            </p>
            <div class="flex flex-wrap gap-3">
              <MagentaBtn onClick={() => scrollTo("#chapters")}>
                View Table of Contents →
              </MagentaBtn>
              <MagentaBtn href={TOC_PDF_URL} size="sm">
                Download TOC (PDF)
              </MagentaBtn>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <For each={STAT_PILLS}>
              {(s) => (
                <div
                  class="book-card flex flex-col items-center justify-center py-8 rounded-xl"
                  style="background: var(--surface);"
                >
                  <span
                    class="text-4xl font-bold mb-1"
                    style="font-family:'Playfair Display',serif; color: var(--magenta)"
                  >
                    {s.value}
                  </span>
                  <span class="text-slate-400 text-sm uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* ── Key Features ───────────────────────────────────────────────────── */}
      <section class="py-24 px-6" style="background: #0b0f1f">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-14">
            <SectionLabel>Key Features</SectionLabel>
            <h2
              class="text-4xl md:text-5xl"
              style="font-family:'Playfair Display',serif"
            >
              What makes this book{" "}
              <span class="gradient-text italic">different</span>
            </h2>
          </div>
          <div
            class="grid md:grid-cols-2 book-card overflow-hidden rounded-2xl"
            style="background: var(--surface);"
          >
            <ul
              class="p-10 space-y-5 md:border-r"
              style="border-color: rgba(255,255,255,0.06);"
            >
              <For each={KEY_FEATURES_LEFT}>
                {(f) => (
                  <li class="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                    <span
                      class="mt-0.5 shrink-0 text-xs"
                      style="color: var(--magenta)"
                    >
                      ✦
                    </span>
                    {f}
                  </li>
                )}
              </For>
            </ul>
            <ul class="p-10 space-y-5">
              <For each={KEY_FEATURES_RIGHT}>
                {(f) => (
                  <li class="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                    <span
                      class="mt-0.5 shrink-0 text-xs"
                      style="color: var(--magenta)"
                    >
                      ✦
                    </span>
                    {f}
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Philosophy / Audience / Pre-reqs / Coverage ────────────────────── */}
      <section class="py-24 px-6" style="background: #0e101a">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-14">
            <SectionLabel>About This Edition</SectionLabel>
            <h2
              class="text-4xl md:text-5xl"
              style="font-family:'Playfair Display',serif"
            >
              Who is this book <span class="gradient-text italic">for?</span>
            </h2>
          </div>
          <div class="grid sm:grid-cols-2 gap-5">
            <For each={INFO_CARDS}>
              {(card) => (
                <Card class="book-card" style="background: var(--surface);">
                  <CardHeader>
                    <div class="text-3xl mb-3">{card.icon}</div>
                    <CardTitle
                      class="text-white text-lg"
                      style="font-family:'Playfair Display',serif"
                    >
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p class="text-slate-400 text-sm leading-relaxed">
                      {card.body}
                    </p>
                  </CardContent>
                </Card>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* ── Book Statistics / Chapters ─────────────────────────────────────── */}
      <section id="chapters" class="py-24 px-6" style="background: #0b0f1f">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <SectionLabel>Contents</SectionLabel>
            <h2
              class="text-4xl md:text-5xl mb-4"
              style="font-family:'Playfair Display',serif"
            >
              Book <span class="gradient-text italic">Statistics</span>
            </h2>
            <p class="text-slate-400 max-w-xl mx-auto">
              337 figures, 86 worked examples, and 297 pages of rigorous circuit
              theory.
            </p>
          </div>

          <div class="book-card overflow-hidden">
            {/* Header */}
            <div
              class="grid text-xs font-bold uppercase tracking-widest"
              style={`display:grid; ${COL_GRID} background: var(--surface2); border-bottom: 1px solid rgba(255,255,255,0.08); color: #e8edf5;`}
            >
              <div class="px-5 py-4 text-center">Chapter No.</div>
              <div class="px-5 py-4">Title</div>
              <div class="px-5 py-4 text-center">No. of Figures</div>
              <div class="px-5 py-4 text-center">No. of Examples</div>
              <div class="px-5 py-4 text-center">Page Count</div>
            </div>

            {/* Rows */}
            <For each={CHAPTERS}>
              {(ch) => (
                <div
                  class="chapter-row grid items-center"
                  style={`display:grid; ${COL_GRID}`}
                >
                  <div class="px-5 py-5 text-center">
                    <span
                      class="font-mono text-sm font-bold"
                      style={
                        ch.title === ""
                          ? "display:inline-block; padding:2px 8px; border-radius:4px; background:rgba(212,35,110,0.18); color:var(--magenta); font-size:0.7rem;"
                          : "color: var(--magenta);"
                      }
                    >
                      {ch.num}
                    </span>
                  </div>
                  <div class="px-5 py-5">
                    <span class="text-slate-200 text-sm font-medium">
                      {ch.title}
                    </span>
                  </div>
                  <div class="px-5 py-5 text-center text-slate-300 text-sm">
                    {ch.figures}
                  </div>
                  <div class="px-5 py-5 text-center text-slate-300 text-sm">
                    {ch.examples}
                  </div>
                  <div class="px-5 py-5 text-center text-slate-300 text-sm">
                    {ch.pages}
                  </div>
                </div>
              )}
            </For>

            {/* Totals */}
            <div
              class="grid items-center font-bold text-sm"
              style={`display:grid; ${COL_GRID} background: var(--surface2); border-top: 1px solid rgba(255,255,255,0.08); color: #e8edf5;`}
            >
              <div
                class="px-5 py-5 text-center text-xs uppercase tracking-widest"
                style="color: var(--magenta);"
              >
                Total
              </div>
              <div class="px-5 py-5" />
              <div class="px-5 py-5 text-center">{TOTALS.figures}</div>
              <div class="px-5 py-5 text-center">{TOTALS.examples}</div>
              <div class="px-5 py-5 text-center">{TOTALS.pages}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Buy the Book ─────────────────────────────────────────────────── */}
      <section id="buy" class="py-24 px-6" style="background: #0e101a">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <SectionLabel>Get Your Copy</SectionLabel>
            <h2
              class="text-4xl md:text-5xl mb-4"
              style="font-family:'Playfair Display',serif"
            >
              Buy the <span class="gradient-text italic">book</span>
            </h2>
            <p class="text-slate-400 max-w-xl mx-auto">
              Available on Amazon worldwide.
            </p>
          </div>

          <div
            class="book-card rounded-2xl p-10 flex flex-col gap-6"
            style="background: var(--surface);"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-widest mb-2"
                style="color: var(--magenta)"
              >
                Buy the Book
              </p>
              <h3
                class="text-2xl font-bold mb-1"
                style="font-family:'Playfair Display',serif"
              >
                Electronic Circuit Fundamentals
              </h3>
              <p class="text-slate-500 text-sm">
                with Mathcad Examples — A-Imam Al-Sammak
              </p>
            </div>
            <MagentaBtn href={AMAZON_URL} class="px-8 w-fit">
              🛒 Buy Now on Amazon
            </MagentaBtn>

            <div>
              <p class="text-xs text-slate-500 uppercase tracking-widest mb-3">
                Share
              </p>
              <div class="flex flex-wrap gap-2">
                <For each={SOCIAL_LINKS}>
                  {(s) => (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs px-3 py-1.5 rounded font-medium text-slate-300 transition-colors"
                      style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(212,35,110,0.4)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)")
                      }
                    >
                      {s.label}
                    </a>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Downloads ─────────────────────────────────────────────────────── */}
      <section id="download" class="py-24 px-6" style="background: #0b0f1f">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <SectionLabel>Downloads</SectionLabel>
            <h2
              class="text-4xl md:text-5xl mb-4"
              style="font-family:'Playfair Display',serif"
            >
              Free <span class="gradient-text italic">resources</span>
            </h2>
            <p class="text-slate-400 max-w-xl mx-auto">
              Sample chapter, lecture slides, and Mathcad programs — all free.
            </p>
          </div>

          <div
            class="book-card rounded-2xl p-10 flex flex-col gap-4"
            style="background: var(--surface);"
          >
            <UploadedFiles files={homePageData()?.uploadedFiles} />
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <Show when={(homePageData()?.testimonials ?? []).length > 0}>
        <section id="reviews" class="py-24 px-6" style="background: #0b0f1f">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <SectionLabel>Reviews</SectionLabel>
              <h2
                class="text-4xl md:text-5xl mb-4"
                style="font-family:'Playfair Display',serif"
              >
                From <span class="gradient-text italic">happy readers</span>
              </h2>
              <p class="text-slate-400 max-w-xl mx-auto">
                What students and professionals are saying about the book.
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              <For each={displayedTestimonials()}>
                {(t) => (
                  <Card
                    class="book-card flex flex-col"
                    style="background: var(--surface);"
                  >
                    <CardHeader>
                      {/* 5 stars — all Strapi reviews are treated as 5-star */}
                      <Stars count={t.rating} />
                      <CardTitle
                        class="text-white text-base font-semibold mt-3"
                        style="font-family:'Playfair Display',serif"
                      >
                        {t.reviewerTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent class="flex-1">
                      <p class="text-slate-400 text-sm leading-relaxed italic">
                        "{t.quote}"
                      </p>
                    </CardContent>
                    <CardFooter>
                      <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                          <div class="avatar-chip">
                            {initials(t.reviewerName)}
                          </div>
                          <div>
                            <p class="text-white text-sm font-semibold">
                              {t.reviewerName}
                            </p>
                          </div>
                        </div>
                        <Show when={t.source}>
                          <a
                            href={t.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs px-2.5 py-1 rounded-full font-medium"
                            style="background: rgba(212,35,110,0.12); color: var(--magenta); border: 1px solid rgba(212,35,110,0.25);"
                          >
                            {t.source}
                          </a>
                        </Show>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </For>
            </div>
          </div>
        </section>
      </Show>

      {/* ── Author ─────────────────────────────────────────────────────────── */}
      <section id="author" class="py-24 px-6" style="background: #0e101a">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-14">
            <SectionLabel>Meet the Author</SectionLabel>
            <h2
              class="text-4xl md:text-5xl"
              style="font-family:'Playfair Display',serif"
            >
              A-Imam <span class="gradient-text italic">Al-Sammak</span>
            </h2>
          </div>

          {/* Bio card */}
          <div
            class="book-card grid md:grid-cols-2 overflow-hidden rounded-2xl"
            style="background: var(--surface);"
          >
            {/* Left — bio */}
            <div
              class="p-10 flex flex-col justify-center md:border-r"
              style="border-color: rgba(255,255,255,0.06);"
            >
              <p
                class="text-xs font-semibold uppercase tracking-widest mb-4"
                style="color: var(--magenta)"
              >
                Professor of Electronics & Author
              </p>
              <p class="text-slate-300 text-sm leading-relaxed mb-3">
                A-Imam Al-Sammak has over thirty years of university teaching
                experience, where he taught analog and digital communications,
                electric circuits, and electronics. He has published more than
                40 journal and conference papers and holds three patents
                specialising in electronics for digital communications.
              </p>
              <p class="text-slate-400 text-sm leading-relaxed mb-7">
                Dr Al-Sammak acted as a reviewer for international conferences
                and journals including IET Wireless Sensor Systems, IET
                Electronics Letters, IET Communications and IEEE PACRIM. He has
                been a visiting scientist at the University of Victoria, Canada
                and Purdue University, USA.
              </p>
            </div>

            {/* Right — credential chips */}
            <div class="p-10 flex flex-col justify-center gap-3">
              <For each={AUTHOR_CREDENTIALS}>
                {(c) => (
                  <div
                    class="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);"
                  >
                    <span class="text-lg shrink-0 mt-0.5">{c.icon}</span>
                    <p class="text-slate-300 text-sm leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" class="py-24 px-6" style="background: #0b0f1f">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <SectionLabel>Get in Touch</SectionLabel>
            <h2
              class="text-4xl md:text-5xl mb-4"
              style="font-family:'Playfair Display',serif"
            >
              Contact the <span class="gradient-text italic">Author</span>
            </h2>
            <p class="text-slate-400 max-w-xl mx-auto">
              Questions about the book, bulk orders, or speaking engagements?
              Write to{" "}
              <a
                href="mailto:info@electronic-circuits.com"
                style="color: var(--magenta)"
              >
                info@electronic-circuits.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
