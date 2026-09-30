import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // Na cena 3D (React Three Fiber) os objetos do three.js são alterados de forma imperativa
    // dentro do useFrame, que é o padrão recomendado pela biblioteca para não re-renderizar.
    files: ["components/three/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
