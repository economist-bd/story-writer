
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Story, StoryPage } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async structureStory(rawText: string): Promise<Story> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform this text into a structured storybook format in Bengali. 
      Divide the story into 4-6 pages. Each page should have a short piece of narrative text 
      and a vivid description for an illustration.
      
      Text: ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING, description: "The Bengali story text for this page" },
                  imageDescription: { type: Type.STRING, description: "English prompt for generating a storybook illustration" }
                },
                required: ["id", "text", "imageDescription"]
              }
            },
            theme: { type: Type.STRING, description: "One of: magical, classic, minimal, dark" }
          },
          required: ["title", "author", "pages", "theme"]
        }
      }
    });

    const story = JSON.parse(response.text || "{}") as Story;
    return story;
  }

  async generateIllustration(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A beautiful storybook illustration of: ${prompt}. Artistic style: soft watercolor, magical, fairy tale vibes, high quality.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // Return a high quality placeholder if generation fails
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`;
  }
}
