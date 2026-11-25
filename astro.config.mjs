// VEON demo: Servisant homepage (Astro 5, static output in dist/).
import { defineConfig } from "astro/config";

export default defineConfig({
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  devToolbar: { enabled: false },
});
