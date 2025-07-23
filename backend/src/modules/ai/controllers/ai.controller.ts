import { Response } from 'express';
import { SummarizationService } from '../services/summarization.service';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class AIController {
    private summarizationService: SummarizationService;

    constructor(summarizationService?: SummarizationService) {
        this.summarizationService = summarizationService || new SummarizationService();
    }

    summarizeArticle = async (req: AuthenticatedRequest<{ id: string }>, res: Response): Promise<void> => {
        try {
            const summary = await this.summarizationService.summarizeArticle(
                req.params.id,
                req.user!.userId
            );

            res.status(200).json({
                success: true,
                message: 'Article summarized successfully',
                data: { summary }
            });
        } catch (error: any) {
            const statusCode = error.message.includes('not found') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to summarize article'
            });
        }
    };
}
