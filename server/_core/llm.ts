import { GoogleGenerativeAI, type Content, type Part } from "@google/generative-ai";
import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: string;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: any;
  maxTokens?: number;
  outputSchema?: any;
  responseFormat?: any;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string;
    };
    finish_reason: string | null;
  }>;
};

/**
 * Normalizes messages into Google Gemini format.
 */
function normalizeToGemini(messages: Message[]): Content[] {
  return messages.map((msg) => {
    const parts: Part[] = [];
    const contents = Array.isArray(msg.content) ? msg.content : [msg.content];

    for (const content of contents) {
      if (typeof content === "string") {
        parts.push({ text: content });
      } else if (content.type === "text") {
        parts.push({ text: content.text });
      } else if (content.type === "image_url") {
        // Note: Gemini SDK handles images via inlineData or fileData. 
        // For URLs, we'd normally need to fetch them. Simplifying for now.
        parts.push({ text: `[Image URL: ${content.image_url.url}]` });
      }
    }

    return {
      role: msg.role === "assistant" ? "model" : "user",
      parts,
    };
  });
}

/**
 * Invokes the Google Gemini API.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  if (!ENV.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(ENV.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const geminiMessages = normalizeToGemini(params.messages);

  // Handle system instruction if present in messages
  const systemMessage = params.messages.find(m => m.role === "system");
  const history = geminiMessages.filter(m => params.messages[geminiMessages.indexOf(m)].role !== "system");

  const chat = model.startChat({
    history: history.slice(0, -1),
    systemInstruction: systemMessage ? (typeof systemMessage.content === "string" ? systemMessage.content : JSON.stringify(systemMessage.content)) : undefined,
  });

  const lastMessage = history[history.length - 1];
  if (!lastMessage) {
    throw new Error("No messages provided to LLM");
  }

  const result = await chat.sendMessage(lastMessage.parts);
  const response = await result.response;
  const text = response.text();

  return {
    id: `gemini-${Date.now()}`,
    created: Math.floor(Date.now() / 1000),
    model: "gemini-1.5-flash",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: text,
        },
        finish_reason: "stop",
      },
    ],
  };
}
