import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Admin secret from environment variable
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

export async function GET(request: NextRequest) {
  try {
    // Check for admin secret in headers
    const adminSecretHeader = request.headers.get('ADMIN_SECRET');
    
    if (!ADMIN_SECRET || adminSecretHeader !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing admin secret.' },
        { status: 401 }
      );
    }

    // Fetch total users count
    const totalUsers = await prisma.user.count();

    // Fetch total videos count
    const totalVideos = await prisma.video.count();

    // Fetch videos by status
    const videosByStatus = await prisma.video.groupBy({
      by: ['status'],
      _count: true,
    });

    // Calculate total storage used (in MB)
    // Assuming average video size of 50MB for completed videos
    const completedVideosCount = videosByStatus.find(v => v.status === 'completed')?._count || 0;
    const totalStorageMB = completedVideosCount * 50;

    // Calculate revenue placeholder
    // Assuming: 70% of users are on Pro (£19/mo), 20% on Business (£49/mo), 10% on Free
    const proUsers = Math.floor(totalUsers * 0.7);
    const businessUsers = Math.floor(totalUsers * 0.2);
    const monthlyRevenue = (proUsers * 19) + (businessUsers * 49);
    const annualRevenue = monthlyRevenue * 12;

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get video generation stats for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVideos = await prisma.video.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get average video duration
    const durationStats = await prisma.video.aggregate({
      where: {
        duration: {
          not: null,
        },
      },
      _avg: {
        duration: true,
      },
    });

    // Get credits distribution
    const creditsStats = await prisma.user.aggregate({
      _avg: {
        credits: true,
      },
      _min: {
        credits: true,
      },
      _max: {
        credits: true,
      },
    });

    // Get template usage stats
    const templateUsage = await prisma.video.groupBy({
      by: ['templateId'],
      _count: true,
      where: {
        templateId: {
          not: null,
        },
      },
    });

    const stats = {
      // Core metrics
      totalUsers,
      totalVideos,
      totalStorageMB: Math.round(totalStorageMB * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue),
      annualRevenue: Math.round(annualRevenue),
      
      // Video status breakdown
      videoStatus: {
        processing: videosByStatus.find(v => v.status === 'processing')?._count || 0,
        completed: videosByStatus.find(v => v.status === 'completed')?._count || 0,
        failed: videosByStatus.find(v => v.status === 'failed')?._count || 0,
        draft: videosByStatus.find(v => v.status === 'draft')?._count || 0,
      },
      
      // Time-based metrics
      recentSignups,
      recentVideos,
      signupGrowth: recentSignups > 0 ? ((recentSignups / totalUsers) * 100).toFixed(1) + '%' : '0%',
      videoGrowth: recentVideos > 0 ? ((recentVideos / totalVideos) * 100).toFixed(1) + '%' : '0%',
      
      // Performance metrics
      averageVideoDuration: Math.round(durationStats._avg.duration || 0),
      averageCredits: Math.round(creditsStats._avg.credits || 0),
      minCredits: creditsStats._min.credits || 0,
      maxCredits: creditsStats._max.credits || 0,
      
      // Template usage
      templateUsage: templateUsage.map(t => ({
        templateId: t.templateId,
        count: t._count,
      })),
      
      // System info
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseProvider: process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'SQLite',
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}