import { VideoStatus } from '@/types';

export interface VideoGenerationOptions {
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  duration: number; // in seconds
  style?: 'cinematic' | 'animated' | 'minimal' | 'bold';
}

export interface VideoGenerationResult {
  success: boolean;
  videoUrl?: string;
  error?: string;
  status: VideoStatus;
  progress: number;
}

/**
 * Video generation service that integrates with OpenRouter API for AI script generation
 * Falls back to placeholder video generation if OPENROUTER_API_KEY is not set
 */
export class VideoGenerationService {
  private openRouterApiKey: string | undefined;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY;
  }

  /**
   * Generate a video based on the provided options
   * If OpenRouter API key is available, generates AI script and creates video
   * Otherwise, simulates generation with a placeholder video
   */
  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    const { prompt, aspectRatio, duration, style = 'cinematic' } = options;

    // Validate duration
    if (duration < 5 || duration > 60) {
      return {
        success: false,
        error: 'Duration must be between 5 and 60 seconds',
        status: VideoStatus.FAILED,
        progress: 0,
      };
    }

    // If OpenRouter API key is not set, use placeholder generation
    if (!this.openRouterApiKey) {
      console.log('OPENROUTER_API_KEY not set, using placeholder video generation');
      return this.generatePlaceholderVideo(options);
    }

    try {
      // Step 1: Generate video script using OpenRouter API
      const script = await this.generateVideoScript(prompt, duration, style);
      
      // Step 2: Generate video based on script (simulated for now)
      // In a real implementation, this would call a video generation API
      const videoUrl = await this.generateVideoFromScript(script, aspectRatio, duration);
      
      return {
        success: true,
        videoUrl,
        status: VideoStatus.COMPLETED,
        progress: 100,
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed',
        status: VideoStatus.FAILED,
        progress: 0,
      };
    }
  }

  /**
   * Generate a video script using OpenRouter API with Claude 3 Haiku
   */
  private async generateVideoScript(
    prompt: string,
    duration: number,
    style: string
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://t4n-ads.vercel.app',
        'X-Title': 'T4N Ads - AI Video Generation',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku:beta',
        messages: [
          {
            role: 'system',
            content: `You are a professional video script writer. Create a concise video script for a ${duration}-second ad.
              Style: ${style}
              Format: Provide scene descriptions with timing markers.
              Structure: Hook (0-3s), Problem (3-10s), Solution (10-${duration-5}s), Call to Action (${duration-5}-${duration}s).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * Generate video from script (simulated implementation)
   * In a real implementation, this would call a video generation API like RunwayML, Pika Labs, etc.
   */
  private async generateVideoFromScript(
    script: string,
    aspectRatio: string,
    duration: number
  ): Promise<string> {
    // Simulate video generation processing time
    await new Promise(resolve => setTimeout(resolve, 5000));

    // For now, return a placeholder video URL
    // In production, this would be the actual generated video URL
    const placeholderVideos = {
      '16:9': 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '9:16': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '1:1': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    };

    return placeholderVideos[aspectRatio as keyof typeof placeholderVideos] || 
           'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  /**
   * Generate a placeholder video for development/testing
   */
  private async generatePlaceholderVideo(
    options: VideoGenerationOptions
  ): Promise<VideoGenerationResult> {
    const { aspectRatio, duration } = options;

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Return placeholder video based on aspect ratio
    const placeholderVideos = {
      '16:9': 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '9:16': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '1:1': 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    };

    const videoUrl = placeholderVideos[aspectRatio as keyof typeof placeholderVideos] || 
                    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    return {
      success: true,
      videoUrl,
      status: VideoStatus.COMPLETED,
      progress: 100,
    };
  }

  /**
   * Simulate progress updates for a video generation job
   * Useful for polling status updates
   */
  async simulateProgress(jobId: string): Promise<{ progress: number; status: VideoStatus }> {
    // Simulate progress over time
    const progress = Math.min(100, Math.floor(Math.random() * 30) + 10);
    
    let status: VideoStatus = VideoStatus.PROCESSING;
    if (progress >= 100) {
      status = VideoStatus.COMPLETED;
    }

    return { progress, status };
  }

  /**
   * Get estimated cost for video generation based on duration and style
   */
  estimateCost(duration: number, style: string): number {
    const baseCost = 1; // 1 credit per 5 seconds
    const styleMultiplier = {
      cinematic: 1.5,
      animated: 2.0,
      minimal: 1.0,
      bold: 1.3,
    }[style] || 1.0;

    return Math.ceil((duration / 5) * baseCost * styleMultiplier);
  }
}

// Export singleton instance
export const videoGenerationService = new VideoGenerationService();

// Export convenience function
export async function generateVideo(
  prompt: string,
  aspectRatio: '16:9' | '9:16' | '1:1' = '16:9',
  duration: number = 15
): Promise<VideoGenerationResult> {
  return videoGenerationService.generateVideo({
    prompt,
    aspectRatio,
    duration,
  });
}