import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "coverage"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off", 
      "@typescript-eslint/no-unused-vars": "warn",

      "@typescript-eslint/no-explicit-any": "warn", 

      "no-console": "off", 
      "security/detect-object-injection": "off", 
    },
  }
);