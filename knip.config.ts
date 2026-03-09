/**
 * Knip configuration for better-openclaw monorepo
 *
 * Note on unused dependencies:
 * - Some dependencies are intentionally kept for future features
 * - UI libraries (accordion, slot, badge, etc.) are for upcoming components
 * - Auth adapters are for planned authentication features
 * - Dev tools (dotenv, tailwindcss, rimraf, etc.) are used in scripts
 * See .knip-notes.md for detailed explanations
 */
const config = {
  ignoreFiles: [
    "scripts/**",
    "**/__tests__/**",
    "**/test-utils/**",
    "**/test-helpers/**",
    "**/test-fixtures/**",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*test-helpers.ts",
    "**/*test-fixtures.ts",
    "**/*test-harness.ts",
    "**/*test-utils.ts",
    "**/*mocks.ts",
    "**/*.mock.ts",
    "**/*.fixture.ts",
    "**/*.fixtures.ts",
    // Alternative/WIP files - kept for future use
    "**/page-alternate.tsx",
    "**/page-alternative.tsx",
    "**/*-alternative.tsx",
    // Unused UI components - kept for future use
    "**/ui/accordion.tsx",
    "**/ui/badge.tsx",
    "**/ui/button.tsx",
    "**/ui/card.tsx",
    // Comparison and FAQ sections - planned for future
    "**/comparison-section.tsx",
    "**/faq-section.tsx",
    // Promo video index - not an entry point
    "**/promo-video/src/index.ts",
    // Tenant lib - utility for future multi-tenancy
    "**/lib/tenant.ts",
  ],
  ignoreExportsUsedInFile: {
    // Allow exports used within the same file (common pattern for public API)
    interface: true,
    type: true,
  },
  workspaces: {
    ".": {
      entry: ["packages/*/src/index.ts!"],
      project: [
        "packages/*/src/**/*.ts!",
        "scripts/**/*.{js,mjs,cjs,ts,mts,cts}!",
        "*.config.{js,mjs,cjs,ts,mts,cts}!",
      ],
    },
    "packages/core": {
      entry: ["src/index.ts!", "src/cli.ts!"],
      project: ["src/**/*.ts!"],
    },
    "packages/cli": {
      entry: ["src/index.ts!"],
      project: ["src/**/*.ts!"],
      ignoreDependencies: ["@better-openclaw/core"],
    },
    "packages/api": {
      entry: ["src/index.ts!", "src/app.ts!"],
      project: ["src/**/*.ts!"],
      ignoreDependencies: ["@better-openclaw/core"],
    },
    "packages/web": {
      entry: ["src/app/layout.tsx!", "src/app/page.tsx!", "next.config.ts!"],
      project: ["src/**/*.{ts,tsx}!"],
      ignoreDependencies: ["@better-openclaw/core"],
      ignore: [
        // Blog exports - public API for future blog functionality
        "src/lib/blogPosts.ts",
        "src/lib/blog/index.ts",
        // API client - public API exports
        "src/lib/api-client.ts",
        // Deploy provider types - public API
        "src/components/stack-builder/use-deploy.ts",
        // Marketplace types - public API
        "src/components/stack-builder/use-marketplace-search.ts",
        // Curated skills utilities - may be used in future
        "src/components/stack-builder/use-curated-skills.ts",
      ],
    },
    "packages/mission-control": {
      entry: ["src/main.tsx!", "vite.config.ts!", "convex/**/*.ts!"],
      project: ["src/**/*.{ts,tsx}!", "convex/**/*.ts!"],
    },
    "packages/promo-video": {
      entry: ["src/Root.tsx!", "remotion.config.ts!"],
      project: ["src/**/*.{ts,tsx}!"],
      ignore: [
        // Animation utilities - may be used in future scenes
        "src/utils/animations.ts",
      ],
    },
  },
} as const;

export default config;
