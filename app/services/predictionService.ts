import OpenAI from 'openai';

export class PredictionService {
  private static instance: PredictionService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  public static getInstance(): PredictionService {
    if (!PredictionService.instance) {
      PredictionService.instance = new PredictionService();
    }
    return PredictionService.instance;
  }

  async predictTrend(storyTitle: string, storyContent: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing news stories and predicting future trends based on current events. Provide concise, realistic predictions."
          },
          {
            role: "user",
            content: `Based on this news story titled "${storyTitle}" with content: "${storyContent}", what are the likely future developments and implications in the next few months? Keep the response under 200 words.`
          }
        ],
        model: "gpt-4-turbo-preview",
      });

      return completion.choices[0]?.message?.content || "Unable to generate prediction";
    } catch (error) {
      console.error('Error generating prediction:', error);
      return "Unable to generate prediction at this time";
    }
  }
}
