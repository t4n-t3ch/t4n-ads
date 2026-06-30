import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check for admin secret header
    const adminSecret = request.headers.get('ADMIN_SECRET');
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Admin secret not configured on server' },
        { status: 500 }
      );
    }

    if (!adminSecret || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin secret' },
        { status: 401 }
      );
    }

    // Fetch stats from database
    const [
      totalUsers,
      totalVideos,
      completedVideos,
      processingVideos,
      failedVideos,
      totalCredits,
      usedCredits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.video.count(),
      prisma.video.count({ where: { status: 'completed' } }),
      prisma.video.count({ where: { status: 'processing' } }),
      prisma.video.count({ where: { status: 'failed' } }),
      prisma.user.aggregate({
        _sum: {
          credits: true,
        },
      }),
      prisma.video.aggregate({
        _sum: {
          creditCost: true,
        },
      }),
    ]);

    // Calculate revenue placeholder (assuming £0.02 per credit used)
    const revenue = (usedCredits._sum.creditCost || 0) * 0.02;

    // Get recent signups (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentSignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Get popular video durations
    const durationStats = await prisma.video.groupBy({
      by: ['duration'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Get template usage stats
    const templateStats = await prisma.video.groupBy({
      by: ['templateId'],
      _count: {
        id: true,
      },
      where: {
        templateId: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Get active users (users who created videos in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await prisma.user.count({
      where: {
        videos: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    });

    const stats = {
      users: {
        total: totalUsers,
        recentSignups,
        activeUsers,
        activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      },
      videos: {
        total: totalVideos,
        completed: completedVideos,
        processing: processingVideos,
        failed: failedVideos,
        completionRate: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
      },
      credits: {
        total: totalCredits._sum.credits || 0,
        used: usedCredits._sum.creditCost || 0,
        available: (totalCredits._sum.credits || 0) - (usedCredits._sum.creditCost || 0),
      },
      revenue: {
        estimated: parseFloat(revenue.toFixed(2)),
        currency: 'GBP',
      },
      durationDistribution: durationStats.map(stat => ({
        duration: stat.duration,
        count: stat._count.id,
        percentage: totalVideos > 0 ? Math.round((stat._count.id / totalVideos) * 100) : 0,
      })),
      templateUsage: templateStats.map(stat => ({
        templateId: stat.templateId,
        count: stat._count.id,
      })),
      system: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin secret header
    const adminSecret = request.headers.get('ADMIN_SECRET');
    const expectedSecret = process.env.ADMIN_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Admin secret not configured on server' },
        { status: 500 }
      );
    }

    if (!adminSecret || adminSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin secret' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'reset-stats':
        // This is a placeholder for actual reset logic
        // In production, you might want to archive stats instead of resetting
        return NextResponse.json({
          message: 'Stats reset functionality would be implemented here',
          action,
          data,
        });

      case 'generate-report':
        // Placeholder for report generation
        return NextResponse.json({
          message: 'Report generation would be implemented here',
          action,
          data,
        });

      case 'cleanup-old-data':
        // Example: Delete videos older than 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        const deletedCount = await prisma.video.deleteMany({
          where: {
            createdAt: {
              lt: ninetyDaysAgo,
            },
            status: 'completed', // Only delete completed videos
          },
        });

        return NextResponse.json({
          message: 'Old data cleanup completed',
          deletedCount: deletedCount.count,
        });

      default:
        return NextResponse.json(
          { error: 'Unknown admin action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute admin action' },
      { status: 500 }
    );
  }
}