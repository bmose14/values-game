import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const buildVersion = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.APP_VERSION ?? "v0.0.0";
const buildLastUpdated = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.APP_LAST_UPDATED ?? "Unknown";

export default defineConfig({
  base: "/values-game/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
    __APP_LAST_UPDATED__: JSON.stringify(buildLastUpdated),
  },
});
