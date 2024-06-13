import { defineConfig, devices } from "@playwright/test";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { WorkerConfigOptions } from "playwright-ssr";
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// eslint-disable-next-line
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP: "next" | "react" | "nuxt" | "vue";
      SSR: string;
    }
  }
}

if (!process.env.APP) {
  throw new Error("APP environment variable is required");
}

if (["nuxt", "next"].includes(process.env.APP)) {
  process.env.SSR = "true";
}

const webServers = {
  next: { args: ["dev"], cwd: "tmp/app/next" },
  react: { args: ["start"], cwd: "tmp/app/react-app" },
  nuxt: { args: ["preview"], cwd: "tmp/app/nuxt" },
  vue: { args: ["vite", "preview", "--port", "3000"], cwd: "tmp/app/vue" },
  vuetify: {
    args: ["vite", "preview", "--port", "3000"],
    cwd: "tmp/app/vuetify",
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<WorkerConfigOptions>({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  /* Run tests in files in parallel */
  fullyParallel: !process.env.SSR,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI || process.env.SSR ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    ignoreHTTPSErrors: true,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        webServer: {
          command: "pnpm",
          args: webServers[process.env.APP]["args"],
          url: "http://localhost:3000",
          cwd: resolve(__dirname, webServers[process.env.APP]["cwd"]),
        },
        /*         process.env.SSR
          ? {
              command: "pnpm",
              args: webServers[process.env.APP]["args"],
              url: "http://localhost:3000",
              cwd: resolve(__dirname, webServers[process.env.APP]["cwd"]),
            }
          : undefined, */
      },
    },

    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    // },

    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: process.env.SSR
  //   ? undefined
  //   : {
  //       cwd: resolve(__dirname, webServers[process.env.APP]["cwd"]),
  //       ignoreHTTPSErrors: true,
  //       command: ["pnpm", ...webServers[process.env.APP]["args"]].join(" "),
  //       url: "http://localhost:3000/",
  //       reuseExistingServer: !process.env.CI,
  //     },
});
