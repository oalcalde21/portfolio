import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": 0,
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
