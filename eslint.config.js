// eslint.config.js
export default [
  {
    ignores: ["node_modules/", "dist/", "migrations/", "models/"], // Directories to ignore
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        // Define global variables for different environments
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        jest: "readonly",
      },
    },
    rules: {},
  },
];
