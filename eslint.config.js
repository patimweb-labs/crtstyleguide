import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

// Flat config: ESLint 10 no longer reads .eslintrc.json. Same rule set as the
// legacy file it replaces (eslint:recommended + @typescript-eslint/recommended,
// browser + node globals, no-unused-vars as a warning with ^_ args ignored).
export default [
    {
        ignores: ["dist/**", "node_modules/**"]
    },
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module"
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        },
        rules: {
            // @typescript-eslint/eslint-recommended, which the legacy `extends`
            // pulled in implicitly: without it, `js.configs.recommended` reports
            // type-only names such as EventListener as undefined.
            ...tsPlugin.configs["eslint-recommended"].overrides[0].rules,
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_"
                }
            ]
        }
    }
];
