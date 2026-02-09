import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import securityPlugin from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  securityPlugin.configs.recommended,
  sonarjs.configs.recommended,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  {
    rules: {
      "security/detect-object-injection": "off",
      "sonarjs/no-all-duplicated-branches": "error",
    },
  },
]);

export default eslintConfig;
