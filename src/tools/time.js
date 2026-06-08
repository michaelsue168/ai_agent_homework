import { DEFAULT_TIMEZONE } from "../config.js";

export const getTimeTool = {
  type: "function",
  function: {
    name: "get_time",
    description: "Get the current local date and time for a timezone.",
    parameters: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "IANA timezone, e.g. Asia/Taipei",
        },
      },
    },
  },
};

export async function getTime({ timezone = DEFAULT_TIMEZONE } = {}) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: timezone,
      hour12: false,
    });
    return {
      timezone,
      iso: now.toISOString(),
      local_time: formatter.format(now),
    };
  } catch {
    return { error: `invalid timezone: ${timezone}` };
  }
}

