import express, {Express, NextFunction, Request, Response} from 'express';
import {portfolioRouter} from './routes/portfolio.routes';

export function createBackendApiApp(): Express {
  const apiApp = express();

  apiApp.disable('x-powered-by');
  apiApp.use(express.json({limit: '256kb'}));

  // Measure real server execution time for REST API inspection
  apiApp.use('/api', (_req: Request, res: Response, next: NextFunction) => {
    const startHrTime = process.hrtime.bigint();
    res.setHeader('Cache-Control', 'no-store');
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      const elapsedNs = Number(process.hrtime.bigint() - startHrTime);
      const elapsedMs = (elapsedNs / 1_000_000).toFixed(2);
      if (!res.headersSent) {
        res.setHeader('X-Backend-Engine', 'Express.js');
        res.setHeader('X-Response-Time-Ms', elapsedMs);
      }
      return originalJson(body);
    };
    next();
  });

  apiApp.use('/api', portfolioRouter);

  // Catch unmatched /api/* routes cleanly with JSON 404
  apiApp.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Không tìm thấy endpoint REST API: ${req.method} ${req.originalUrl}`,
    });
  });

  return apiApp;
}
