import OpenAI from "openai";
import {
  OPENAI_API_KEY,
  DEFAULT_CHAT_MODEL,
  DEFAULT_EMBEDDING_MODEL,
} from "../config.js";

export const client = new OpenAI({ apiKey: OPENAI_API_KEY });
export const CHAT_MODEL = DEFAULT_CHAT_MODEL;
export const EMBEDDING_MODEL = DEFAULT_EMBEDDING_MODEL;

