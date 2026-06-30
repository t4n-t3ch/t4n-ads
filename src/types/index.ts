export enum VideoStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  description?: string;
  prompt: string;
  aspectRatio: string;
  duration: number;
  style: string;
  status: VideoStatus;
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewUrl: string;
  aspectRatio: string;
  duration: number;
  style: string;
  promptExample: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateRequest {
  prompt: string;
  aspectRatio: string;
  duration: number;
  style: string;
  templateId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalCreditsPurchased: number;
  revenue: number;
  activeUsers: number;
  processingVideos: number;
}