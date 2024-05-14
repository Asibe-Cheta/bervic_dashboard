import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

eslint: {ignoreDuringBuilds: true

}

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
});
