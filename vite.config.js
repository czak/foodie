/// <reference types="vitest/config" />

import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  test: {
    watch: false,
  },
});
