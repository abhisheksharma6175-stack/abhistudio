import test from "node:test";
import assert from "node:assert/strict";

import { getEnvValue, getServerConfig } from "./env";

test("getEnvValue returns fallback in development", () => {
  const value = getEnvValue("SESSION_SECRET", "dev-secret");
  assert.equal(value, "dev-secret");
});

test("getServerConfig is strict in production", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const originalSessionSecret = process.env.SESSION_SECRET;

  Object.defineProperty(process.env, "NODE_ENV", {
    value: "production",
    configurable: true,
  });
  delete process.env.DATABASE_URL;
  delete process.env.SESSION_SECRET;

  assert.throws(() => getServerConfig(), /DATABASE_URL|SESSION_SECRET/);

  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;

  if (originalSessionSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = originalSessionSecret;

  Object.defineProperty(process.env, "NODE_ENV", {
    value: originalEnv || "development",
    configurable: true,
  });
});
