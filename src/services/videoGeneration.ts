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
 * Video generation service that integrates with OpenRouter AI
 * If OPENROUTER_API_KEY is not set, it simulates generation with a placeholder
 */
export class VideoGenerationService {
  private static instance: VideoGenerationService;
  private openRouterApiKey: string | undefined;
  private simulationDelay: number = 5000; // 5 seconds for simulation

  private constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY;
  }

  public static getInstance(): VideoGenerationService {
    if (!VideoGenerationService.instance) {
      VideoGenerationService.instance = new VideoGenerationService();
    }
    return VideoGenerationService.instance;
  }

  /**
   * Generate a video based on the provided options
   */
  public async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    try {
      // If OpenRouter API key is not set, simulate generation
      if (!this.openRouterApiKey) {
        console.log('OpenRouter API key not set, simulating video generation...');
        return this.simulateVideoGeneration(options);
      }

      // Generate video script using OpenRouter API
      const script = await this.generateVideoScript(options.prompt, options.style);
      
      // In a real implementation, this would call a video generation API
      // For now, we'll simulate the process and return a placeholder
      // TODO: Integrate with actual video generation API (RunwayML, Pika Labs, etc.)
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        videoUrl: this.generatePlaceholderVideoUrl(options),
        status: VideoStatus.COMPLETED,
        progress: 100
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during video generation',
        status: VideoStatus.FAILED,
        progress: 0
      };
    }
  }

  /**
   * Generate a video script using OpenRouter API with Claude 3 Haiku
   */
  private async generateVideoScript(prompt: string, style?: string): Promise<string> {
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const systemPrompt = `You are a professional video script writer. Create a concise video script based on the user's prompt.
    Format the script as a sequence of scenes with visual descriptions, voiceover text, and timing cues.
    Keep it engaging and suitable for ${style || 'cinematic'} style.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://t4n-ads.vercel.app',
        'X-Title': 'T4N Ads - AI Video Generation'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku:beta',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a video script for: ${prompt}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No script generated';
  }

  /**
   * Simulate video generation for development/testing
   */
  private async simulateVideoGeneration(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, this.simulationDelay));
    
    return {
      success: true,
      videoUrl: this.generatePlaceholderVideoUrl(options),
      status: VideoStatus.COMPLETED,
      progress: 100
    };
  }

  /**
   * Generate a placeholder video URL based on options
   * Using Pexels placeholder service for realistic video placeholders
   */
  private generatePlaceholderVideoUrl(options: VideoGenerationOptions): string {
    const { aspectRatio, duration } = options;
    
    // Map aspect ratio to dimensions
    const dimensions: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 }
    };
    
    const { width, height } = dimensions[aspectRatio] || dimensions['16:9'];
    
    // Use Pexels placeholder service with different categories based on style
    const categories = ['nature', 'technology', 'business', 'people', 'abstract'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate a unique ID for cache busting
    const uniqueId = Date.now();
    
    return `https://images.pexels.com/videos/1234567/free-video-${randomCategory}-${width}x${height}.mp4?auto=compress&cs=tinysrgb&h=${height}&w=${width}&dpr=2&cache=${uniqueId}`;
  }

  /**
   * Check if OpenRouter API is configured
   */
  public isOpenRouterConfigured(): boolean {
    return !!this.openRouterApiKey;
  }

  /**
   * Get estimated generation time based on duration and style
   */
  public getEstimatedTime(duration: number, style?: string): number {
    let baseTime = duration * 100; // 100ms per second of video
    if (style === 'animated') baseTime *= 1.5;
    if (style === 'cinematic') baseTime *= 1.2;
    return Math.min(baseTime, 60000); // Max 60 seconds
  }
}

// Export singleton instance
export const videoGenerationService = VideoGenerationService.getInstance();

// Export convenience function
export async function generateVideo(
  prompt: string,
  aspectRatio: '16:9' | '9:16' | '1:1' = '16:9',
  duration: number = 15
): Promise<VideoGenerationResult> {
  const service = VideoGenerationService.getInstance();
  return service.generateVideo({
    prompt,
    aspectRatio,
    duration,
    style: 'cinematic'
  });
}