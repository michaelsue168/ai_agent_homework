import { getOpenWeatherApiKey } from "../config.js";

export const getWeatherTool = {
  type: "function",
  function: {
    name: "get_weather",
    description: "Get weather for a given city.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name in English, e.g. Taipei, Tokyo",
        },
      },
      required: ["city"],
    },
  },
};

export async function getWeather({ city }) {
  if (!city || typeof city !== "string") {
    return { error: "city is required" };
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", getOpenWeatherApiKey());
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "zh_tw");

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    return { error: `OpenWeather API error ${res.status}`, details: text };
  }

  const data = await res.json();
  return {
    city: data.name,
    temperature_c: data.main?.temp,
    humidity: data.main?.humidity,
    weather: data.weather?.[0]?.description,
  };
}
