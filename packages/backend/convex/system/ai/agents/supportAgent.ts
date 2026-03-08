import { createOpenAI } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const supportAgent = new Agent(components.agent, {
  chat: openrouter.chat("nvidia/nemotron-3-nano-30b-a3b:free"),
  instructions: SUPPORT_AGENT_PROMPT,
});
