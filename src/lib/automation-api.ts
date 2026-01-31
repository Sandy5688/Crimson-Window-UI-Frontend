import { api } from './api';

// Automation API endpoints (proxied through Gateway to Dev-E-Auto)
const AUTOMATION_BASE = '/api/v1/automation';

export interface BotStatus {
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  lastRun?: string;
  nextRun?: string;
  postsToday?: number;
  errors?: number;
}

export interface AutomationStats {
  totalPosts: number;
  postsToday: number;
  postsThisWeek: number;
  totalEngagements: number;
  activeBots: number;
  pausedBots: number;
}

export interface ScheduledPost {
  id: string;
  platform: string;
  caption: string;
  scheduledAt: string;
  status: 'pending' | 'published' | 'failed';
  mediaUrl?: string;
  error?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  platform: string;
  timestamp: string;
  details?: string;
  status: 'success' | 'error' | 'info';
}

// Get automation stats overview
export async function getAutomationStats(): Promise<AutomationStats> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/stats`);
  return response.data;
}

// Get all bot statuses
export async function getBotStatus(): Promise<BotStatus[]> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/bots/status`);
  return response.data;
}

// Run a specific bot
export async function runBot(botName: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/bots/${botName}/run`);
  return response.data;
}

// Pause a specific bot
export async function pauseBot(botName: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/bots/${botName}/pause`);
  return response.data;
}

// Resume/restart a specific bot
export async function resumeBot(botName: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/bots/${botName}/restart`);
  return response.data;
}

// Restart all cron jobs
export async function restartAllBots(): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/cron/restart`);
  return response.data;
}

// Get post queue
export async function getPostQueue(): Promise<ScheduledPost[]> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/queue`);
  return response.data;
}

// Get activity logs
export async function getActivityLogs(limit = 50): Promise<ActivityLog[]> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/activity?limit=${limit}`);
  return response.data;
}

// Get recent logs
export async function getLogs(limit = 100): Promise<string[]> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/logs?limit=${limit}`);
  return response.data;
}

// Schedule a new post
export async function schedulePost(data: {
  platform: string;
  caption: string;
  mediaUrl?: string;
  scheduledAt: string;
}): Promise<{ success: boolean; postId: string }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/schedule-post`, data);
  return response.data;
}

// Retry failed posts
export async function retryFailedPosts(): Promise<{ success: boolean; retriedCount: number }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/retry-failed`);
  return response.data;
}

// Get automation settings
export async function getSettings(): Promise<Record<string, unknown>> {
  const response = await api.get(`${AUTOMATION_BASE}/admin/settings`);
  return response.data;
}

// Save automation settings
export async function saveSettings(settings: Record<string, unknown>): Promise<{ success: boolean }> {
  const response = await api.post(`${AUTOMATION_BASE}/admin/settings`, settings);
  return response.data;
}

// Health check
export async function checkHealth(): Promise<{ status: string; service: string }> {
  const response = await api.get(`${AUTOMATION_BASE}/health`);
  return response.data;
}
