import {Request, Response} from 'express';
import {portfolioStore} from '../data/portfolio.store';
import {ContactPayload} from '../models/portfolio.model';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getProfileHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    source: 'express-backend',
    timestamp: new Date().toISOString(),
    data: portfolioStore.getProfile(),
  });
};

export const getSkillsHandler = (req: Request, res: Response): void => {
  const category = typeof req.query['category'] === 'string' ? req.query['category'] : undefined;
  const skills = portfolioStore.getSkills(category);

  res.status(200).json({
    success: true,
    source: 'express-backend',
    filter: category ?? 'all',
    count: skills.length,
    data: skills,
  });
};

export const getProjectsHandler = (req: Request, res: Response): void => {
  const category = typeof req.query['category'] === 'string' ? req.query['category'] : undefined;
  const projects = portfolioStore.getProjects(category);

  res.status(200).json({
    success: true,
    source: 'express-backend',
    filter: category ?? 'all',
    count: projects.length,
    data: projects,
  });
};

export const getProjectDetailHandler = (req: Request, res: Response): void => {
  const slugParam = req.params['slug'];
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const project = slug ? portfolioStore.getProjectBySlug(slug) : undefined;

  if (!project) {
    res.status(404).json({
      success: false,
      error: 'Không tìm thấy dự án theo định danh yêu cầu.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    source: 'express-backend',
    data: project,
  });
};

export const getArchitectureHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    source: 'express-backend',
    receivedContactsCount: portfolioStore.getRecentMessagesCount(),
    data: portfolioStore.getArchitecture(),
  });
};

export const submitContactHandler = (req: Request, res: Response): void => {
  const body = req.body as Partial<ContactPayload> | undefined;

  if (!body || typeof body !== 'object') {
    res.status(400).json({
      success: false,
      error: 'Dữ liệu gửi lên không hợp lệ.',
    });
    return;
  }

  const senderName = typeof body.senderName === 'string' ? body.senderName.trim() : '';
  const senderEmail = typeof body.senderEmail === 'string' ? body.senderEmail.trim() : '';
  const organization = typeof body.organization === 'string' ? body.organization.trim() : '';
  const topic = typeof body.topic === 'string' ? body.topic.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (senderName.length < 2) {
    res.status(400).json({
      success: false,
      error: 'Vui lòng nhập họ tên hợp lệ (tối thiểu 2 ký tự).',
    });
    return;
  }

  if (!EMAIL_PATTERN.test(senderEmail)) {
    res.status(400).json({
      success: false,
      error: 'Địa chỉ email không đúng định dạng.',
    });
    return;
  }

  if (message.length < 10) {
    res.status(400).json({
      success: false,
      error: 'Nội dung trao đổi cần tối thiểu 10 ký tự.',
    });
    return;
  }

  const saved = portfolioStore.saveContactMessage({
    senderName,
    senderEmail,
    organization,
    topic: topic || 'Trao đổi cơ hội hợp tác / tuyển dụng',
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Cảm ơn bạn đã liên hệ. Tin nhắn đã được ghi nhận tại máy chủ Express.js.',
    data: saved,
  });
};
