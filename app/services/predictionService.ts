import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Story, Timeline } from '../models/story';

// Configure Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

class PredictionService {
  private static instance: PredictionService;

  private constructor() {}

  static getInstance(): PredictionService {
    if (!PredictionService.instance) {
      PredictionService.instance = new PredictionService();
    }
    return PredictionService.instance;
  }

  private generatePromptForTimeframe(
    story: Story,
    timeframe: Timeline['timeframe'],
    tone: Timeline['tone']
  ): string {
    return `You are a future prediction expert. Analyze this news story and generate a ${tone} prediction for ${timeframe} into the future.

News Story:
Title: ${story.title}
Description: ${story.description}

Based on this news, create a prediction that is:
1. ${tone.charAt(0).toUpperCase() + tone.slice(1)} in tone
2. Focused on developments ${timeframe} into the future
3. Grounded in current trends and realistic possibilities
4. Specific and detailed in its implications

Format your response exactly like this example:
Title: [A compelling title for this future prediction]
Summary: [2-3 sentences explaining the prediction]
Probability: [A number between 1-100 representing the likelihood]

Remember to:
- Be creative but plausible
- Consider technological, social, and economic factors
- Maintain the ${tone} perspective throughout
- Provide specific details and consequences`;
  }

  private async generatePredictionForTimeframe(
    story: Story,
    timeframe: Timeline['timeframe'],
    tone: Timeline['tone']
  ): Promise<Timeline> {
    try {
      const prompt = this.generatePromptForTimeframe(story, timeframe, tone);
      
      // Get the Gemini Pro model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      // Generate the response
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      // Parse the response
      const titleMatch = response.match(/Title: (.*)\n/);
      const summaryMatch = response.match(/Summary: (.*)\n/);
      const probabilityMatch = response.match(/Probability: (\d+)/);

      if (!titleMatch || !summaryMatch || !probabilityMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      return {
        timeframe,
        title: titleMatch[1],
        summary: summaryMatch[1],
        tone,
        probability: parseInt(probabilityMatch[1])
      };
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }

  async generatePredictions(story: Story, tone: Timeline['tone']): Promise<Timeline[]> {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not configured');
    }

    const timeframes: Timeline['timeframe'][] = ['1month', '1year', '10years'];
    
    try {
      // Generate predictions in sequence to avoid rate limiting
      const predictions = [];
      for (const timeframe of timeframes) {
        const prediction = await this.generatePredictionForTimeframe(story, timeframe, tone);
        predictions.push(prediction);
      }
      
      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw error;
    }
  }
}

export default PredictionService.getInstance();
