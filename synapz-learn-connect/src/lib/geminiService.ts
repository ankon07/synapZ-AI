import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Test function to list available models
export async function listAvailableModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    const data = await response.json();
    console.log('Available models:', data);
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
    return null;
  }
}

export interface StoryImage {
  prompt: string;
  description: string;
  story: string;
  imageUrl?: string;
  timestamp: number;
}

// Generate a child-friendly story based on a prompt
export async function generateStory(prompt: string): Promise<{ story: string; imagePrompt: string }> {
  try {
    // Using gemini-2.5-flash which is available and stable
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const enhancedPrompt = `
You are creating a short, engaging story for a child with ADHD. The story should be:
- Simple and easy to follow (3-5 sentences)
- Visually descriptive for image generation
- Positive and encouraging
- Educational or teaches a valuable lesson
- Fun and engaging with colorful characters

User's idea: ${prompt}

Please provide:
1. A short story (3-5 sentences)
2. A detailed image description that captures the main scene of the story

Format your response as:
STORY: [the story here]
IMAGE: [detailed image description for generation]
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const storyMatch = text.match(/STORY:\s*(.+?)(?=IMAGE:|$)/s);
    const imageMatch = text.match(/IMAGE:\s*(.+?)$/s);

    const story = storyMatch ? storyMatch[1].trim() : text;
    const imagePrompt = imageMatch ? imageMatch[1].trim() : `A colorful, child-friendly illustration of: ${prompt}`;

    return { story, imagePrompt };
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
}

// Generate an image using free AI image generation services
export async function generateImage(imagePrompt: string): Promise<string> {
  try {
    // Enhance prompt for child-friendly, colorful imagery
    const enhancedPrompt = `Colorful children's book illustration, cartoon style, bright and cheerful: ${imagePrompt}. Simple shapes, happy atmosphere, educational, suitable for kids, vibrant colors, friendly characters`;
    
    console.log('Generating AI image with prompt:', enhancedPrompt);
    
    // Use Pollinations.ai - completely free, no API key, works reliably
    // This service generates images on-demand via URL
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    
    // Pollinations.ai URL - this will generate and serve the image directly
    // Parameters:
    // - width/height: image dimensions
    // - seed: for reproducibility (using timestamp for uniqueness)
    // - nologo: remove watermark
    // - model: use default stable diffusion
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=450&seed=${Date.now()}&nologo=true&model=flux`;
    
    console.log('Generated image URL:', imageUrl);
    
    // Return the URL - the browser will fetch the image directly
    return imageUrl;
  } catch (error) {
    console.error('Error generating image URL:', error);
    
    // Fallback: Use a simpler prompt if the enhanced one fails
    const simplePrompt = encodeURIComponent(`children's cartoon: ${imagePrompt.slice(0, 100)}`);
    return `https://image.pollinations.ai/prompt/${simplePrompt}?width=800&height=450&nologo=true`;
  }
}

// Get suggestions for prompts
export async function getPromptSuggestions(): Promise<string[]> {
  return [
    "A brave little robot learning to share toys",
    "A friendly dragon teaching children about emotions",
    "A magic garden where kindness makes flowers bloom",
    "A superhero who gains power from being polite",
    "A talking backpack helping with daily routines",
    "An adventure about making new friends at school",
    "A space explorer learning to focus and stay calm",
    "A wise owl teaching about healthy eating habits"
  ];
}

// Enhance user prompt to be more child-appropriate
export function enhancePromptForChildren(userPrompt: string): string {
  const childFriendlyThemes = [
    "with bright colors and happy characters",
    "that teaches a valuable life lesson",
    "with a positive and encouraging message",
    "suitable for young children",
    "with simple and clear storytelling"
  ];
  
  return `${userPrompt} ${childFriendlyThemes[Math.floor(Math.random() * childFriendlyThemes.length)]}`;
}
