import OpenAI from 'openai';
import { config } from '../../../config/environment';
import {
  ArticleRepository,
  IArticleRepository,
} from '../../../modules/articles/repositories/article.repository';

export interface ISummarizationService {
  summarizeArticle(articleId: string, userId: string): Promise<string>;
}

export class SummarizationService implements ISummarizationService {
  private openai: OpenAI;
  private articleRepository: IArticleRepository;

  constructor(articleRepository?: IArticleRepository) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
    this.articleRepository = articleRepository || new ArticleRepository();
  }

  async summarizeArticle(articleId: string, userId: string): Promise<string> {
    const article = await this.articleRepository.findById(articleId, userId);

    if (!article) {
      throw new Error(
        'Article not found or you do not have permission to access it'
      );
    }

    if (article.summary) {
      return article.summary;
    }

    let summary: string;

    try {
      summary = await this.generateAISummary(article.title, article.body);
    } catch (error) {
      console.warn('OpenAI API failed, using fallback summary:', error);
      summary = this.generateMockSummary(article.title, article.body);
    }

    await this.articleRepository.updateSummary(articleId, summary);

    return summary;
  }

  private async generateAISummary(
    title: string,
    body: string
  ): Promise<string> {
    const prompt = `Summarize the following article in 2-3 concise sentences. Focus on the main points and key takeaways.

Title: ${title}

Content: ${body}

Summary:`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const summary = response.choices[0].message.content?.trim();

    if (!summary) {
      throw new Error('OpenAI returned empty response');
    }

    return summary;
  }

  private generateMockSummary(title: string, body: string): string {
    const sentences = body.match(/[^\.!?]+[\.!?]+/g) || [];
    const firstTwoSentences = sentences.slice(0, 2).join(' ').trim();

    if (firstTwoSentences.length > 20) {
      return firstTwoSentences;
    }

    return `This article titled "${title}" provides insights and information on the topic. The content covers key concepts and important details relevant to the subject matter discussed.`;
  }
}
