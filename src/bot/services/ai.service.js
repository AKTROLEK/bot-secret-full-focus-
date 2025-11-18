import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Service for streamer assistance
 */
export class AIService {
  /**
   * Generate smart response for streamer queries
   */
  static async generateResponse(prompt, language = 'ar') {
    try {
      const systemPrompt = language === 'ar'
        ? 'أنت مساعد ذكي متخصص في مساعدة الستريمرز. قدم نصائح مفيدة ودقيقة باللغة العربية.'
        : 'You are a smart assistant specialized in helping streamers. Provide useful and accurate advice.';

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return language === 'ar'
        ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
        : 'Sorry, an error occurred processing your request. Please try again.';
    }
  }

  /**
   * Analyze content and provide suggestions
   */
  static async analyzeContent(contentData, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `قم بتحليل المحتوى التالي وقدم اقتراحات للتحسين:\n\nالعنوان: ${contentData.title}\nالوصف: ${contentData.description}\nالمنصة: ${contentData.platform}\nعدد المشاهدات: ${contentData.views}\nمعدل التفاعل: ${contentData.engagement}%\n\nقدم نصائح محددة وقابلة للتطبيق.`
        : `Analyze the following content and provide improvement suggestions:\n\nTitle: ${contentData.title}\nDescription: ${contentData.description}\nPlatform: ${contentData.platform}\nViews: ${contentData.views}\nEngagement: ${contentData.engagement}%\n\nProvide specific and actionable advice.`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Content Analysis Error:', error);
      return null;
    }
  }

  /**
   * Suggest optimal streaming time based on audience data
   */
  static async suggestStreamingTime(audienceData, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `بناءً على بيانات الجمهور التالية، اقترح أفضل أوقات البث:\n\nعدد المتابعين: ${audienceData.followers}\nالموقع الجغرافي الأساسي: ${audienceData.primaryLocation}\nالمنصة: ${audienceData.platform}\nأوقات الذروة السابقة: ${audienceData.peakTimes.join(', ')}\n\nقدم توصيات محددة بالأيام والساعات.`
        : `Based on the following audience data, suggest optimal streaming times:\n\nFollowers: ${audienceData.followers}\nPrimary Location: ${audienceData.primaryLocation}\nPlatform: ${audienceData.platform}\nPrevious Peak Times: ${audienceData.peakTimes.join(', ')}\n\nProvide specific recommendations with days and hours.`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Streaming Time Suggestion Error:', error);
      return null;
    }
  }

  /**
   * Generate video title and description
   */
  static async generateVideoMetadata(topic, platform, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `أنشئ عنواناً جذاباً ووصفاً مُحسَّناً لمحرك البحث لفيديو عن: ${topic}\nالمنصة: ${platform}\n\nقدم:\n1. عنوان جذاب (60 حرف كحد أقصى)\n2. وصف مُحسَّن (200-300 كلمة)\n3. كلمات مفتاحية مقترحة`
        : `Create an engaging title and SEO-optimized description for a video about: ${topic}\nPlatform: ${platform}\n\nProvide:\n1. Engaging title (max 60 characters)\n2. Optimized description (200-300 words)\n3. Suggested keywords`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Video Metadata Generation Error:', error);
      return null;
    }
  }

  /**
   * Detect rule violations in content
   */
  static async detectViolations(contentDescription, rules, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `قم بتحليل المحتوى التالي للتحقق من المخالفات:\n\nوصف المحتوى: ${contentDescription}\n\nالقوانين:\n${rules.join('\n')}\n\nحدد أي مخالفات محتملة وقدم توضيحاً.`
        : `Analyze the following content for violations:\n\nContent Description: ${contentDescription}\n\nRules:\n${rules.join('\n')}\n\nIdentify any potential violations and explain.`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Violation Detection Error:', error);
      return null;
    }
  }

  /**
   * Generate video script outline
   */
  static async generateScript(topic, duration, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `أنشئ مخططاً لسكربت فيديو عن: ${topic}\nالمدة: ${duration} دقيقة\n\nقدم:\n1. المقدمة (30 ثانية)\n2. المحتوى الرئيسي (نقاط رئيسية مع توقيت)\n3. الخاتمة والدعوة للإجراء (30 ثانية)`
        : `Create a video script outline about: ${topic}\nDuration: ${duration} minutes\n\nProvide:\n1. Introduction (30 seconds)\n2. Main Content (key points with timing)\n3. Conclusion and Call-to-Action (30 seconds)`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Script Generation Error:', error);
      return null;
    }
  }

  /**
   * Provide personalized tips for streamer
   */
  static async getPersonalizedTips(streamerData, language = 'ar') {
    try {
      const prompt = language === 'ar'
        ? `قدم نصائح شخصية لتحسين الأداء بناءً على البيانات التالية:\n\nعدد المقاطع الأسبوعية: ${streamerData.weeklyVideos}\nساعات البث الأسبوعية: ${streamerData.weeklyStreamHours}\nمتوسط المشاهدات: ${streamerData.avgViews}\nمعدل التفاعل: ${streamerData.engagement}%\nالمنصات: ${streamerData.platforms.join(', ')}\n\nقدم 3-5 نصائح محددة وقابلة للتطبيق.`
        : `Provide personalized tips to improve performance based on:\n\nWeekly Videos: ${streamerData.weeklyVideos}\nWeekly Stream Hours: ${streamerData.weeklyStreamHours}\nAverage Views: ${streamerData.avgViews}\nEngagement Rate: ${streamerData.engagement}%\nPlatforms: ${streamerData.platforms.join(', ')}\n\nProvide 3-5 specific and actionable tips.`;

      return await this.generateResponse(prompt, language);
    } catch (error) {
      console.error('Personalized Tips Error:', error);
      return null;
    }
  }
}

export default AIService;
