import { createSignal, For } from "solid-js";
import { Button } from "@/components/ui/button";

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Chapters", href: "#chapters" },
  { label: "Reviews", href: "#reviews" },
  { label: "Author", href: "#author" },
  { label: "Download", href: "#download" },
  { label: "Contact", href: "#contact" },
];

export function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = createSignal(false);

  const handleNavClick = (href: string) => {
    scrollTo(href);
    setMobileOpen(false);
  };

  return (
    <header
      class="sticky top-0 z-50 backdrop-blur-md"
      style="border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(11,15,31,0.82);"
    >
      <div class="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div class="flex items-center gap-2">
          <span class="text-2xl" style="color: var(--magenta)">
            📚
          </span>
          <span
            class="font-bold text-lg tracking-tight"
            style="font-family:'Playfair Display',serif"
          >
            Electronic Circuits
          </span>
        </div>

        {/* Desktop nav */}
        <nav class="hidden md:flex items-center gap-6">
          <For each={NAV_LINKS}>
            {(link) => (
              <a
                href={link.href}
                class="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            )}
          </For>
        </nav>

        <div class="flex items-center gap-3">
          <Button
            size="sm"
            class="hidden md:flex font-semibold text-white"
            style="background: var(--magenta); border: none;"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e63d7a")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--magenta)")
            }
            onClick={() => scrollTo("#buy")}
          >
            Get the Book
          </Button>

          {/* Hamburger */}
          <button
            class="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen())}
            aria-label="Toggle menu"
          >
            {mobileOpen() ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen() && (
        <div
          class="md:hidden px-6 py-4 flex flex-col gap-4"
          style="background: var(--surface); border-top: 1px solid rgba(255,255,255,0.05);"
        >
          <For each={NAV_LINKS}>
            {(link) => (
              <a
                href={link.href}
                class="nav-link text-base"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            )}
          </For>
          <Button
            class="font-semibold mt-2 text-white"
            style="background: var(--magenta); border: none;"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e63d7a")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--magenta)")
            }
            onClick={() => scrollTo("#download")}
          >
            Get the Book
          </Button>
        </div>
      )}
    </header>
  );
}
