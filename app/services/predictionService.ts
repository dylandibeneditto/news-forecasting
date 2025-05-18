import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Story, Timeline, Trend, Possibility, HistoricAnalogy, IndustryImpact } from '../models/story';

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

  private generatePrompt(
    story: Story,
    tone: Timeline['tone']
  ): string {
    return `You are a future prediction expert. Analyze this news story and generate comprehensive predictions with a ${tone} perspective.

News Story:
Title: ${story.title}
Description: ${story.description}

IMPORTANT: Your entire response must be valid, parseable JSON with no other text. Do not include any explanations, markdown, or text outside the JSON object.

Generate a response in this exact JSON format:

{
  "overallAnalysis": {
    "trends": [
      {
        "name": "Name of trend (e.g., GDP Growth, Housing Market)",
        "direction": "up/down/stable",
        "value": "Percentage change prediction as a number"
      }
    ],
    "historicAnalogies": [
      {
        "event": "Name of similar historical event",
        "year": "Year of the event",
        "similarity": "Similarity percentage as a number (1-100)",
        "lessons": "Key lessons from this historical parallel"
      }
    ],
    "impactedIndustries": [
      {
        "name": "Industry name",
        "impact": "Impact percentage as a number (1-100)"
      }
    ],
    "possibilities": [
      {
        "scenario": "Possible future scenario",
        "probability": "Probability percentage as a number (1-100)",
        "consequences": [
          "List of 2-3 specific consequences"
        ]
      }
    ]
  },
  "timeframes": {
    "1month": {
      "title": "A specific event title for 1-month prediction",
      "summary": "2-3 sentences about a specific plausible event that will happen in 1 month",
      "probability": "Likelihood percentage as a number (1-100)"
    },
    "1year": {
      "title": "A specific event title for 1-year prediction",
      "summary": "2-3 sentences about a specific plausible event that will happen in 1 year",
      "probability": "Likelihood percentage as a number (1-100)"
    },
    "10years": {
      "title": "A specific event title for 10-year prediction",
      "summary": "2-3 sentences about a specific plausible event that will happen in 10 years",
      "probability": "Likelihood percentage as a number (1-100)"
    }
  }
}

Requirements for overall analysis:
- Include at least 4 major trends (e.g., GDP, housing market, employment, technology adoption)
- Include 3 relevant historical analogies
- Include impact analysis for 5-7 industries
- Include 3-4 possible future scenarios with consequences
- Maintain a ${tone} perspective throughout
- Ensure all numerical values are actual numbers, not strings with numbers

Requirements for timeframe predictions:
- For each timeframe, describe ONE SPECIFIC plausible event (not general trends)
- Include concrete details like numbers, dates, or specific actions
- Make each timeframe prediction focused on different aspects of the future
- Events should become more transformative as the timeframe extends

General requirements:
- Ensure all probabilities and impacts are numerical values, not strings
- Make predictions that are creative but plausible
- Consider technological, social, and economic factors
- Provide specific details and numerical predictions`;
  }

  private generateFallbackData(tone: Timeline['tone']): any {
    const fallbackTrends: Trend[] = [
      { name: "GDP Growth", direction: tone === 'optimistic' ? 'up' : tone === 'pessimistic' ? 'down' : 'stable', value: tone === 'optimistic' ? 3.2 : tone === 'pessimistic' ? -1.8 : 0.5 },
      { name: "Housing Market", direction: tone === 'optimistic' ? 'up' : 'down', value: tone === 'optimistic' ? 8.7 : -4.3 },
      { name: "Unemployment Rate", direction: tone === 'optimistic' ? 'down' : 'up', value: tone === 'optimistic' ? -0.8 : 2.5 },
      { name: "Consumer Confidence", direction: tone === 'optimistic' ? 'up' : tone === 'pessimistic' ? 'down' : 'stable', value: tone === 'optimistic' ? 12.4 : tone === 'pessimistic' ? -9.1 : 1.3 },
    ];

    const fallbackPossibilities: Possibility[] = [
      {
        scenario: tone === 'optimistic' ? "Rapid economic recovery" : "Economic recession deepens",
        probability: tone === 'optimistic' ? 75 : 65,
        consequences: [
          tone === 'optimistic' ? "Stock markets reach new highs" : "Widespread business closures",
          tone === 'optimistic' ? "Job creation accelerates" : "Unemployment rises sharply",
          tone === 'optimistic' ? "Consumer spending increases" : "Consumer spending decreases"
        ]
      },
      {
        scenario: tone === 'optimistic' ? "Technological innovation surge" : "Supply chain disruptions",
        probability: tone === 'optimistic' ? 68 : 58,
        consequences: [
          tone === 'optimistic' ? "New productivity tools emerge" : "Product shortages increase",
          tone === 'optimistic' ? "Remote work solutions improve" : "Manufacturing delays continue",
          tone === 'optimistic' ? "Digital economy expands rapidly" : "Inflation of goods increases"
        ]
      },
      {
        scenario: "Political landscape shifts",
        probability: 50,
        consequences: [
          "New policies implemented",
          "Regulatory changes affect businesses",
          "International relations realigned"
        ]
      }
    ];

    const fallbackAnalogies: HistoricAnalogy[] = [
      {
        event: tone === 'optimistic' ? "Post-WWII Economic Boom" : "2008 Financial Crisis",
        year: tone === 'optimistic' ? "1950s" : "2008",
        similarity: tone === 'optimistic' ? 72 : 68,
        lessons: tone === 'optimistic' 
          ? "Period of rapid growth following major disruption can lead to new economic paradigms and opportunities"
          : "Unregulated markets and excessive risk can lead to systemic collapse requiring massive intervention"
      },
      {
        event: tone === 'optimistic' ? "Dot-com Recovery" : "Dot-com Bubble",
        year: tone === 'optimistic' ? "2003-2007" : "2000",
        similarity: 65,
        lessons: tone === 'optimistic'
          ? "Tech sector can quickly rebound and lead broader economic recovery through innovation"
          : "Overvaluation of new technologies can lead to market corrections and economic contraction"
      },
      {
        event: "1970s Oil Crisis",
        year: "1973",
        similarity: 54,
        lessons: "Resource dependency creates economic vulnerabilities that can disrupt global markets"
      }
    ];

    const fallbackIndustries: IndustryImpact[] = [
      { 
        name: "Technology", 
        impact: tone === 'optimistic' ? 85 : 62 
      },
      { 
        name: "Healthcare", 
        impact: tone === 'optimistic' ? 74 : 56 
      },
      { 
        name: "Manufacturing", 
        impact: tone === 'optimistic' ? 65 : 48 
      },
      { 
        name: "Retail", 
        impact: tone === 'optimistic' ? 58 : 35 
      },
      { 
        name: "Financial Services", 
        impact: tone === 'optimistic' ? 70 : 45 
      },
      { 
        name: "Energy", 
        impact: tone === 'optimistic' ? 78 : 52 
      }
    ];

    const getSpecificEvents = () => {
      if (tone === 'optimistic') {
        return {
          "1month": {
            title: "Initial Market Rally",
            summary: "The stock market experiences a sudden 12% rally as investor confidence returns. Major tech companies announce expansion plans and new job creation initiatives across multiple regions.",
            probability: 78
          },
          "1year": {
            title: "Manufacturing Renaissance",
            summary: "Advanced manufacturing technologies drive a 15% increase in domestic production. New factory construction begins in six major cities, creating thousands of skilled jobs and revitalizing local economies.",
            probability: 65
          },
          "10years": {
            title: "Green Energy Revolution",
            summary: "Renewable energy achieves price parity with fossil fuels, spurring massive infrastructure transformation. Over 70% of vehicles sold are now electric, and carbon emissions have decreased by 40% from 2020 levels.",
            probability: 55
          }
        };
      } else if (tone === 'pessimistic') {
        return {
          "1month": {
            title: "Market Correction",
            summary: "Major stock indices drop by 8% amid growing economic concerns. Several large retailers announce store closures affecting thousands of employees across multiple regions.",
            probability: 73
          },
          "1year": {
            title: "Housing Market Contraction",
            summary: "Housing prices fall 15% nationwide as mortgage rates reach 8.5%. Construction of new homes slows dramatically, with major developers canceling planned projects in key metropolitan areas.",
            probability: 68
          },
          "10years": {
            title: "Resource Competition Crisis",
            summary: "Global competition for scarce resources intensifies, leading to trade restrictions and regional conflicts. Water scarcity affects over 2 billion people, causing mass migration from drought-affected regions.",
            probability: 55
          }
        };
      } else {
        return {
          "1month": {
            title: "Mixed Economic Signals",
            summary: "The Federal Reserve announces a 0.25% interest rate change after analyzing conflicting economic indicators. Several major companies release quarterly reports showing mixed results across different sectors.",
            probability: 72
          },
          "1year": {
            title: "Technology Sector Realignment",
            summary: "A significant shift occurs in the technology industry as companies adapt to new regulatory frameworks. Several mergers and acquisitions reshape the competitive landscape of major digital service providers.",
            probability: 65
          },
          "10years": {
            title: "New Work Paradigm",
            summary: "The workforce undergoes a fundamental transformation as automation reaches 35% penetration across industries. Traditional employment concepts are replaced by a more fluid system of project-based work and specialized services.",
            probability: 58
          }
        };
      }
    };

    const specificEvents = getSpecificEvents();

    return {
      overallAnalysis: {
        trends: fallbackTrends,
        possibilities: fallbackPossibilities,
        historicAnalogies: fallbackAnalogies,
        impactedIndustries: fallbackIndustries
      },
      timeframes: {
        "1month": {
          title: specificEvents["1month"].title,
          summary: specificEvents["1month"].summary,
          probability: specificEvents["1month"].probability
        },
        "1year": {
          title: specificEvents["1year"].title,
          summary: specificEvents["1year"].summary,
          probability: specificEvents["1year"].probability
        },
        "10years": {
          title: specificEvents["10years"].title,
          summary: specificEvents["10years"].summary,
          probability: specificEvents["10years"].probability
        }
      }
    };
  }

  private safeParseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const numericMatch = value.match(/(\d+(\.\d+)?)/);
      if (numericMatch) {
        return parseFloat(numericMatch[0]);
      }
    }
    return 0;
  }

  async generatePredictions(story: Story, tone: Timeline['tone']): Promise<Timeline[]> {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY is not configured, using fallback data');
      return this.generateFallbackPredictions(story, tone);
    }

    try {
      const prompt = this.generatePrompt(story, tone);
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      console.log('Raw response from AI:', response.substring(0, 200) + '...');
      
      try {
        let prediction;
        try {
          prediction = JSON.parse(response);
        } catch (parseError) {
          console.error('Initial JSON parsing failed, attempting to extract valid JSON');
          
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              prediction = JSON.parse(jsonMatch[0]);
              console.log('Successfully extracted JSON with regex');
            } catch (extractError) {
              console.error('Failed to extract JSON with regex:', extractError);
              throw parseError;
            }
          } else {
            throw parseError;
          }
        }
        
        const { overallAnalysis, timeframes } = prediction;
        
        if (!overallAnalysis || !timeframes) {
          console.error('Missing expected structure in prediction:', 
            'overallAnalysis exists:', !!overallAnalysis, 
            'timeframes exists:', !!timeframes);
          return this.generateFallbackPredictions(story, tone);
        }

        const predictions: Timeline[] = ['1month', '1year', '10years'].map(timeframe => ({
          timeframe: timeframe as Timeline['timeframe'],
          title: timeframes[timeframe].title,
          summary: timeframes[timeframe].summary,
          tone,
          probability: parseInt(timeframes[timeframe].probability) || 50,
          trends: (overallAnalysis.trends || []).map((trend: any) => ({
            name: trend.name,
            direction: trend.direction as 'up' | 'down' | 'stable',
            value: this.safeParseNumber(trend.value)
          })),
          possibilities: (overallAnalysis.possibilities || []).map((possibility: any) => ({
            scenario: possibility.scenario,
            probability: this.safeParseNumber(possibility.probability),
            consequences: possibility.consequences || []
          })),
          historicAnalogies: (overallAnalysis.historicAnalogies || []).map((analogy: any) => ({
            event: analogy.event,
            year: analogy.year,
            similarity: this.safeParseNumber(analogy.similarity),
            lessons: analogy.lessons
          })),
          impactedIndustries: (overallAnalysis.impactedIndustries || []).map((industry: any) => ({
            name: industry.name,
            impact: this.safeParseNumber(industry.impact)
          }))
        }));
        
        return predictions;
      } catch (error) {
        console.error('Error parsing prediction:', error);
        console.warn('Using fallback data due to parsing error');
        return this.generateFallbackPredictions(story, tone);
      }
    } catch (error) {
      console.error('Error generating predictions:', error);
      console.warn('Using fallback data due to API error');
      return this.generateFallbackPredictions(story, tone);
    }
  }

  private generateFallbackPredictions(story: Story, tone: Timeline['tone']): Timeline[] {
    const fallbackData = this.generateFallbackData(tone);
    const { overallAnalysis, timeframes } = fallbackData;

    return ['1month', '1year', '10years'].map(timeframe => ({
      timeframe: timeframe as Timeline['timeframe'],
      title: timeframes[timeframe].title,
      summary: timeframes[timeframe].summary,
      tone,
      probability: timeframes[timeframe].probability,
      trends: overallAnalysis.trends,
      possibilities: overallAnalysis.possibilities,
      historicAnalogies: overallAnalysis.historicAnalogies,
      impactedIndustries: overallAnalysis.impactedIndustries
    }));
  }
}

export default PredictionService.getInstance();
