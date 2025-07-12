import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig,
  safetySettings,
});

// Function to convert a File object to a GoogleGenerativeAI.Part object
async function fileToGenerativePart(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: file.type,
    },
  };
}

export async function generateProductListing(image: File) {
  const imagePart = await fileToGenerativePart(image);

  const prompt = `
    You are an expert e-commerce copywriter for a platform selling unique, handmade goods from independent artists. Your tone is warm, appreciative, and highlights the craftsmanship.

    Analyze the provided image of a product and generate a product listing in a clean JSON format. The JSON object must have exactly four keys: "title", "description", "tags", and "customization_possible".

    - "title": Create a catchy, SEO-friendly title under 60 characters.
    - "description": Write an evocative, single-paragraph description (around 250 characters) that tells a story about the item, its potential use, and what makes it special.
    - "tags": Provide a comma-separated string of 8-10 relevant, long-tail keywords that a potential buyer might search for.
    - "customization_possible": Based on the item, determine if a customer could reasonably request a customization (e.g., different color, size, personalized text). Return true or false.

    Do not include the JSON markdown wrapper or any other text outside of the JSON object.
  `;

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text();
  
  try {
    // The model sometimes returns the JSON wrapped in markdown.
    // We need to extract the raw JSON string.
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    const jsonString = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing Gemini response:", text, error);
    throw new Error("Failed to generate product listing. The AI returned an invalid format.");
  }
}