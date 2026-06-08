import "dotenv/config";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const OPENAI_API_KEY = getRequiredEnv("OPENAI_API_KEY");
export const DEFAULT_CHAT_MODEL = "gpt-5-mini";
export const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export const DEFAULT_TIMEZONE = "Asia/Taipei";

export function getOpenWeatherApiKey() {
  return getRequiredEnv("OPENWEATHER_API_KEY");
}
