import axios from "axios";
import { SystemPrompt } from "../Promt/SystemPromt";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


const TIMEOUT = 300000; 

// function validateInputs(prompt: string): void {
//   if (!prompt?.trim()) {
//     throw new Error("Prompt không được để trống");
//   }

//   if (!API_KEY) {
//     throw new Error("API Key không được cấu hình. Vui lòng kiểm tra file .env");
//   }
// }


function createRequestBody(prompt: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: prompt.trim(),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };
}

// Helper function to validate and extract response
function extractResponseText(response: any): string {
  if (!response.data?.candidates?.length) {
    throw new Error("Không nhận được phản hồi từ AI");
  }

  const candidate = response.data.candidates[0];

  if (candidate.finishReason === "SAFETY") {
    throw new Error("Nội dung bị chặn do vi phạm chính sách an toàn");
  }

  if (!candidate.content?.parts?.length) {
    throw new Error("Không có nội dung phản hồi");
  }

  const text = candidate.content.parts[0].text;

  if (!text || text.trim() === "") {
    throw new Error("Phản hồi trống từ AI");
  }

  return text.trim();
}

// Helper function to handle HTTP status errors
function handleHttpError(status: number, data: any): never {
  const errorMessages = {
    400: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại input.",
    401: "API Key không hợp lệ. Vui lòng kiểm tra cấu hình.",
    403: "Không có quyền truy cập API. Kiểm tra API Key và quota.",
    429: "Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.",
    500: "Lỗi server của Google. Vui lòng thử lại sau.",
  };

  const message =
    errorMessages[status as keyof typeof errorMessages] ||
    `Lỗi API: ${data?.error?.message ?? "Unknown error"}`;

  throw new Error(message);
}

// Helper function to handle axios errors
function handleAxiosError(error: any): never {
  if (error.code === "ECONNABORTED") {
    throw new Error("Kết nối timeout. Vui lòng thử lại.");
  }

  if (error.response) {
    handleHttpError(error.response.status, error.response.data);
  }

  if (error.request) {
    throw new Error("Không thể kết nối với server. Kiểm tra kết nối internet.");
  }

  throw new Error("Có lỗi không xác định xảy ra. Vui lòng thử lại.");
}


// Main function with reduced cognitive complexity
export async function CheckWithGemini(prompt: string): Promise<string> {
  // validateInputs(prompt);
  const DataRequest = SystemPrompt + "  Nội dung của người dùng: " + prompt;

  try {
    const body = createRequestBody(DataRequest);

    const response = await axios.post(API_URL, body, {
      timeout: TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });

    return extractResponseText(response);
  } catch (error) {
    if (axios.isAxiosError(error)) handleAxiosError(error);
    if (error instanceof Error) throw error;
    throw new Error("Có lỗi không xác định xảy ra. Vui lòng thử lại.");
  }
}

