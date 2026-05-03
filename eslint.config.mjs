import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Tạm tắt trong giai đoạn merge vì project có nhiều animation/random UI
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",

      // Tạm nới rule để merge trước
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",

      // Các rule này giữ warning, không chặn commit/build
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",

    "emotion-music-player/**",
    "emotion-music-player(2)/**",

    "*.zip",
    "*.tsbuildinfo",
  ]),
]);

export default eslintConfig;
