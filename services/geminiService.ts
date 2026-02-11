import { GoogleGenAI } from "@google/genai";
import { Commission } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateClientUpdate = async (commission: Commission): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "錯誤: 缺少 API Key。";

  const prompt = `
    你是一位專業且親切的流麻訂製店主小幫手。
    請用**繁體中文**為委託人 "${commission.clientName}" 寫一則簡短、有禮貌的進度回報訊息。
    
    訂單資訊：
    - 標題: ${commission.title}
    - 目前狀態: ${commission.status}
    - 類型: ${commission.type}
    
    語氣要親切但專業。
    提到目前的 "${commission.status}" 階段進展順利。
    如果狀態是 "排單中"，請感謝他們的耐心等待。
    如果狀態是 "送印製作"，可以告知已送廠，並預告大約的製作週期。
    如果狀態是 "已寄出"，請告知訂單已出貨，並提醒他們留意包裹。
    字數控制在 100 字以內。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "無法產生回覆。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "產生回覆失敗，請稍後再試。";
  }
};

export const suggestWorkPlan = async (commission: Commission): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "錯誤: 缺少 API Key。";
  
    const prompt = `
      我是一位流麻客製化創作者。請針對這筆訂單，提供我 3 個具體的下一步工作建議清單。
      請用**繁體中文**回答。
      
      訂單類型: ${commission.type}
      描述: ${commission.description}
      目前階段: ${commission.status}
  
      請提供 3 個簡潔、可執行的點列式建議，幫助我推進到下一個階段。例如，如果處於"草稿確認"，建議可以是"規劃壓克力切割線與孔位"；如果處於"送印製作"，建議可以是"準備包裝材料"。
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "無法產生計畫。";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "產生計畫失敗。";
    }
  };