import { GoogleGenAI, Type } from "@google/genai";

// Safe access to API key - works with Vite env variables
const getApiKey = (): string | undefined => {
  // Vite exposes env vars with VITE_ prefix
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
};

const apiKey = getApiKey();

// Only initialize if API key is available
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Throw clear error when trying to use AI without API key
const requireAi = () => {
  if (!ai) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add VITE_GEMINI_API_KEY to your .env file."
    );
  }
  return ai;
};

export interface UserData {
  gender: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  activityLevel: string;
  experience: string;
  daysPerWeek: number;
  injuries: string;
  diseases: string;
  foodPreferences: string;
}

export async function generateFitnessPlan(userData: UserData) {
  const prompt = `
    Generate a comprehensive fitness and nutrition plan for a user with the following data:
    - Gender: ${userData.gender}
    - Age: ${userData.age}
    - Height: ${userData.height} cm
    - Weight: ${userData.weight} kg
    - Goal: ${userData.goal}
    - Activity Level: ${userData.activityLevel}
    - Training Experience: ${userData.experience}
    - Days per week: ${userData.daysPerWeek}
    - Injuries: ${userData.injuries || 'None'}
    - Diseases: ${userData.diseases || 'None'}
    - Food Preferences: ${userData.foodPreferences || 'None'}

    The response MUST be in JSON format and include:
    1. bodyAnalysis: Description of the user's current status and needs.
    2. calories: { maintenance: number, target: number }
    3. macros: { protein: number, fat: number, carbs: number } (in grams)
    4. workoutPlan: Array of days, each with title and exercises.
    5. dietPlan: Sample daily meal plan.
    6. warnings: Safety warnings based on injuries/diseases.
    7. tips: 3 motivational or technical tips.

    IMPORTANT: Adapt specifically to injuries. If back injury mentioned, avoid heavy axial loading. If knee injury, avoid high-impact movements.
  `;

  try {
    const genAI = requireAi();
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bodyAnalysis: { type: Type.STRING },
            calories: {
              type: Type.OBJECT,
              properties: {
                maintenance: { type: Type.NUMBER },
                target: { type: Type.NUMBER }
              },
              required: ["maintenance", "target"]
            },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER }
              },
              required: ["protein", "fat", "carbs"]
            },
            workoutPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  title: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.STRING },
                        reps: { type: Type.STRING },
                        notes: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            dietPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  meal: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["bodyAnalysis", "calories", "macros", "workoutPlan", "dietPlan", "warnings", "tips"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
