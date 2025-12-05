// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["dist/**", "build/**", "node_modules/**"], // ← 这里
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true }, // 👈 关键：让 ESLint/espree 解析 JSX
      },
    },
    settings: {
      react: { version: "detect" }, // ← 解决 “React version not specified” 警告
    },
    plugins: { react },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
      "react/prop-types": "off",
    },
  },
];
