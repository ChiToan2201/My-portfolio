import {Router} from 'express';
import {
  getArchitectureHandler,
  getProfileHandler,
  getProjectDetailHandler,
  getProjectsHandler,
  getSkillsHandler,
  submitContactHandler,
} from '../controllers/portfolio.controller';

export const portfolioRouter = Router();

portfolioRouter.get('/profile', getProfileHandler);
portfolioRouter.get('/skills', getSkillsHandler);
portfolioRouter.get('/projects', getProjectsHandler);
portfolioRouter.get('/projects/:slug', getProjectDetailHandler);
portfolioRouter.get('/architecture', getArchitectureHandler);
portfolioRouter.post('/contact', submitContactHandler);
