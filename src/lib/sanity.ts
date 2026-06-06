// src/lib/sanity.ts
import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: "g9z65r94",
  dataset: "production",
  apiVersion: "2026-05-31",
  useCdn: true,
});
