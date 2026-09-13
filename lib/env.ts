export type ServerEnv = {
  NODE_ENV: string;
  DATABASE_URL: string;
  SESSION_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
};

export function getEnvValue(key: string, fallback?: string): string {
  const value = process.env[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof fallback === "string" && fallback.trim()) return fallback.trim();
  throw new Error(`${key} is not configured.`);
}

export function getServerConfig(): ServerEnv {
  const isProduction = (process.env.NODE_ENV || "development").trim().toLowerCase() === "production";

  const config: ServerEnv = {
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: isProduction ? getEnvValue("DATABASE_URL") : getEnvValue("DATABASE_URL", "mongodb://127.0.0.1:27017/abhistudio-dev"),
    SESSION_SECRET: isProduction ? getEnvValue("SESSION_SECRET") : getEnvValue("SESSION_SECRET", "dev-session-secret-change-me"),
    ADMIN_EMAIL: getEnvValue("ADMIN_EMAIL", "admin@abhistudio.com"),
    ADMIN_PASSWORD: getEnvValue("ADMIN_PASSWORD", "AbhiStudio@2026!"),
  };

  if (isProduction) {
    const requiredKeys = ["DATABASE_URL", "SESSION_SECRET"] as const;
    for (const key of requiredKeys) {
      if (!process.env[key] || !String(process.env[key]).trim()) {
        throw new Error(`Production environment requires ${key}.`);
      }
    }
  }

  return config;
}
