/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Dish, PalateProfile, TastePreference } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSensoryMatch(dish: Dish, profile: PalateProfile): Promise<number> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compare this dish to the user's palate profile and return a match score (0-100).
      Dish: ${dish.name} - ${dish.description}. Tags: ${dish.tags.join(", ")}
      Profile Preferences: ${profile.preferences.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Match score from 0 to 100" },
            reason: { type: Type.STRING, description: "Brief reason for the score" }
          },
          required: ["score", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"score": 50}');
    return result.score;
  } catch (error) {
    console.error("Gemini Match Error:", error);
    return 50; // Fallback score
  }
}

export async function generateDishRecommendations(profile: PalateProfile): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on a user who loves: ${profile.preferences.join(", ")}, suggest 5 specific types of dishes they might enjoy. Return as a plain array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Recs Error:", error);
    return ["Spicy Ramen", "Truffle Pasta", "Crispy Tacos"];
  }
}
