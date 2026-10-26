import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {createBackendApiApp} from './app';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = createBackendApiApp();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve compiled frontend static assets from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Render the Angular Frontend application for non-API routes
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Express.js Backend & SSR Server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
