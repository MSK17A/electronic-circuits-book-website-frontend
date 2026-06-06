import { For, Show } from "solid-js";
import { UploadedFile } from "./home-types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert raw filename → readable chapter title.
 *  e.g. "Chapter 01 BIPOLAR JUNCTION T RANSISTERS (BJT).pptx"
 *       → "Chapter 01 — Bipolar Junction Transistors (BJT)"
 */
function parseTitle(raw: string): { chapterNum: string; title: string } {
  // Strip extension
  const base = raw.replace(/\.[^.]+$/, "");

  // Extract chapter number
  const numMatch = base.match(/^Chapter\s+(\d+)\s+(.+)$/i);
  if (!numMatch) return { chapterNum: "–", title: base };

  const num = numMatch[1].replace(/^0/, ""); // remove leading zero
  const rest = numMatch[2]
    .replace(/_/g, " ")
    // Title-case
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    // Fix common abbreviations back to uppercase
    .replace(/\bBjt\b/g, "BJT")
    .replace(/\bFet\b/g, "FET")
    .replace(/\bIc\b/g, "IC")
    .replace(/\bOp-Amp\b/g, "Op-Amp");

  return { chapterNum: num, title: rest };
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

function fileIcon(ext: string): string {
  if (ext === ".pptx" || ext === ".ppt") return "📊";
  if (ext === ".pdf") return "📄";
  if (ext === ".zip") return "🗜️";
  return "📁";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  files: UploadedFile[] | undefined;
}

export default function UploadedFiles(props: Props) {
  // Sort by chapter number extracted from filename
  const sorted = () => {
    const list = props.files ?? [];
    return [...list].sort((a, b) => {
      const numA = parseInt(a.name.match(/Chapter\s+(\d+)/i)?.[1] ?? "99");
      const numB = parseInt(b.name.match(/Chapter\s+(\d+)/i)?.[1] ?? "99");
      return numA - numB;
    });
  };

  return (
    <div>
      <Show
        when={(props.files ?? []).length > 0}
        fallback={
          <p class="text-slate-600 text-sm italic">No files available yet.</p>
        }
      >
        <div class="flex flex-col gap-2">
          <For each={sorted()}>
            {(file) => {
              const { chapterNum, title } = parseTitle(file.name);
              return (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group"
                >
                  <div
                    class="book-card flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all"
                    style="background: rgba(255,255,255,0.03);"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(212,35,110,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)")
                    }
                  >
                    {/* Icon + name */}
                    <span class="text-lg shrink-0">{fileIcon(file.ext)}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-slate-200 text-sm font-medium truncate">
                        {title}
                      </p>
                      <p class="text-slate-500 text-xs">
                        {file.ext.replace(".", "").toUpperCase()} ·{" "}
                        {formatSize(file.size)}
                      </p>
                    </div>

                    {/* Download arrow */}
                    <span
                      class="text-slate-600 text-sm shrink-0 transition-colors"
                      style="color: #475569;"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--magenta)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#475569")
                      }
                    >
                      ↓
                    </span>
                  </div>
                </a>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
