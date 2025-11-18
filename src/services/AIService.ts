import OpenAI from 'openai';
import { config } from '../config/config';
import logger from '../utils/logger';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.api.openaiApiKey,
    });
  }

  async analyzeContent(content: string, contentType: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert content analyst for streamers. Provide constructive feedback and suggestions.',
          },
          {
            role: 'user',
            content: `Analyze this ${contentType} content and provide improvement suggestions: ${content}`,
          },
        ],
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || 'No analysis available';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateTitle(description: string, platform: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating engaging titles for ${platform} content.`,
          },
          {
            role: 'user',
            content: `Create an engaging title for this content: ${description}`,
          },
        ],
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || 'Untitled';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateDescription(title: string, platform: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at writing compelling descriptions for ${platform} content.`,
          },
          {
            role: 'user',
            content: `Write a description for content titled: ${title}`,
          },
        ],
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async suggestOptimalStreamTime(
    audienceData: any,
    timezone: string = 'UTC'
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at analyzing audience behavior and suggesting optimal streaming times.',
          },
          {
            role: 'user',
            content: `Based on this audience data: ${JSON.stringify(audienceData)}, suggest the best times to stream in ${timezone}`,
          },
        ],
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || 'No suggestion available';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async detectViolations(content: string): Promise<{ hasViolation: boolean; reason?: string }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a content moderation expert. Detect if content violates community guidelines. Respond with YES or NO followed by a reason.',
          },
          {
            role: 'user',
            content: `Check this content for violations: ${content}`,
          },
        ],
        max_tokens: 150,
      });

      const response = completion.choices[0]?.message?.content || 'NO';
      const hasViolation = response.toUpperCase().startsWith('YES');

      return {
        hasViolation,
        reason: hasViolation ? response : undefined,
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateSmartReply(context: string, language: string = 'en'): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant responding in ${language === 'ar' ? 'Arabic' : 'English'}.`,
          },
          {
            role: 'user',
            content: context,
          },
        ],
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || 'No response available';
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }
}
