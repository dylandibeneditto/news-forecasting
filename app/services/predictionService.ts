import OpenAI from 'openai';
import type { Story, Timeline } from '../models/story';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class PredictionService {
  private static instance: PredictionService;

  private constructor() {}

  static getInstance(): PredictionService {
    if (!PredictionService.instance) {
      PredictionService.instance = new PredictionService();
    }
    return PredictionService.instance;
  }

  private async generatePredictionForTimeframe(
    story: Story,
    timeframe: Timeline['timeframe'],
    tone: Timeline['tone']
  ): Promise<Timeline> {
    const prompt = `Based on this news story:
Title: ${story.title}
Description: ${story.description}

Generate a ${tone} prediction for what might happen in ${timeframe}. 
The prediction should be a concise 2-3 sentence summary.
Also include a probability estimate (0-100) of this outcome.
Format: Title | Summary | Probability`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const response = completion.choices[0].message.content || '';
      const [title, summary, probabilityStr] = response.split('|').map(s => s.trim());
      const probability = parseInt(probabilityStr.replace('%', '')) || 50;

      return {
        timeframe,
        title,
        summary,
        tone,
        probability
      };
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }

  async generatePredictions(story: Story, tone: Timeline['tone']): Promise<Timeline[]> {
    const timeframes: Timeline['timeframe'][] = ['1month', '1year', '10years'];
    
    try {
      const predictions = await Promise.all(
        timeframes.map(timeframe => 
          this.generatePredictionForTimeframe(story, timeframe, tone)
        )
      );
      
      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw error;
    }
  }
}

export default PredictionService.getInstance();
