export enum VideoStatus {
  DRAFT = "draft",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed"
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
  style?: string;
  status: VideoStatus;
  progress?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  jobId?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  promptExample: string;
  aspectRatio: string;
  duration: number;
  style: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  isPublic: boolean;
  creditsRequired: number;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
  uses?: number;
}

export interface GenerateRequest {
  prompt: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  duration: number;
  style?: string;
  templateId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  credits: number;
  totalVideos: number;
  completedVideos: number;
  processingVideos: number;
  storageUsed: number; // in MB
}

export interface VideoGenerationJob {
  id: string;
  videoId: string;
  status: VideoStatus;
  progress: number;
  videoUrl?: string;
  estimatedTimeRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  pricePeriod: "month" | "year";
  credits: number;
  features: string[];
  highlighted?: boolean;
  maxDuration: number;
  maxResolution: string;
  branding: boolean;
  prioritySupport: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalCreditsPurchased: number;
  totalRevenue: number;
  activeUsers: number;
  videosByStatus: Record<VideoStatus, number>;
  recentSignups: User[];
  recentVideos: Video[];
}

export interface GalleryFilters {
  status?: VideoStatus;
  aspectRatio?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  userId: string;
  createdAt: Date;
  category?: string;
}