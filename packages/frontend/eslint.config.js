import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist", "node_modules", "coverage", "public"],
    },
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "simple-import-sort": simpleImportSort,
            "react": reactPlugin,
            "react-hooks": reactHooksPlugin,
            "react-refresh": reactRefreshPlugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ["./packages/frontend/tsconfig.json"],
                tsconfigRootDir: "/home/jagaradoz/Documents/engineering-works/taskflow-saas",
            },
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        // Side effect imports.
                        ["^\\u0000"],
                        // Node.js built-ins. You could also generate this regex if you use a `.js` config.
                        // For now, let's just use `^node:`.
                        ["^node:"],
                        // Packages.
                        // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                        ["^@?\\w"],
                        // Internal packages.
                        ["^(@|~)(/.*|$)"],
                        // Relative imports.
                        // Anything that starts with a dot.
                        ["^\\."],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ],
            "@typescript-eslint/no-explicit-any": "warn"
        },
    },
);
