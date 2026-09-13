import test from "node:test";
import assert from "node:assert/strict";

import { getEnvValue, getServerConfig } from "./env";

test("getEnvValue returns fallback in development", () => {
  const value = getEnvValue("SESSION_SECRET", "dev-secret");
  assert.equal(value, "dev-secret");
});

test("getServerConfig is strict in production", () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  delete process.env.SESSION_SECRET;

  assert.throws(() => getServerConfig(), /DATABASE_URL|SESSION_SECRET/);

  process.env.NODE_ENV = originalEnv || "development";
});
