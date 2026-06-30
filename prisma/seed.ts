import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    id: 'template_social_media_15s',
    name: 'Social Media 15s',
    description: 'Perfect for Instagram Reels, TikTok, and YouTube Shorts. Fast-paced, engaging content with trending music.',
    category: 'social',
    duration: 15,
    aspectRatio: '9:16',
    tags: ['social', 'short-form', 'trending', 'music'],
    promptExample: 'Create a 15-second social media ad for a new energy drink that shows people having fun at a beach party with vibrant colors and upbeat music.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 5,
  },
  {
    id: 'template_product_demo_30s',
    name: 'Product Demo 30s',
    description: 'Showcase your product features with clear demonstrations and call-to-action overlays.',
    category: 'product',
    duration: 30,
    aspectRatio: '16:9',
    tags: ['product', 'demo', 'explainer', 'features'],
    promptExample: 'Create a 30-second product demo for a smart home device that shows how it automates lighting, security, and temperature control in a modern home.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 10,
  },
  {
    id: 'template_testimonial_45s',
    name: 'Testimonial 45s',
    description: 'Build trust with customer testimonials featuring authentic stories and results.',
    category: 'testimonial',
    duration: 45,
    aspectRatio: '1:1',
    tags: ['testimonial', 'trust', 'customer', 'storytelling'],
    promptExample: 'Create a 45-second testimonial video for a fitness app featuring a customer who lost 30 pounds in 3 months, showing their journey and results.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 15,
  },
  {
    id: 'template_brand_story_60s',
    name: 'Brand Story 60s',
    description: 'Tell your brand story with emotional narrative, cinematic visuals, and brand messaging.',
    category: 'brand',
    duration: 60,
    aspectRatio: '16:9',
    tags: ['brand', 'story', 'cinematic', 'emotional'],
    promptExample: 'Create a 60-second brand story for a sustainable fashion brand that shows their ethical sourcing process, craftsmanship, and impact on local communities.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 20,
  },
  {
    id: 'template_holiday_sale_20s',
    name: 'Holiday Sale 20s',
    description: 'Limited-time offer template with festive elements, countdown timer, and urgency messaging.',
    category: 'sale',
    duration: 20,
    aspectRatio: '9:16',
    tags: ['sale', 'holiday', 'urgent', 'limited-time'],
    promptExample: 'Create a 20-second holiday sale ad for an e-commerce store with festive decorations, showing discounted products and a countdown timer for the sale ending.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 8,
  },
  {
    id: 'template_app_promo_25s',
    name: 'App Promo 25s',
    description: 'Highlight app features with screen recordings, user interface animations, and download CTAs.',
    category: 'app',
    duration: 25,
    aspectRatio: '9:16',
    tags: ['app', 'mobile', 'download', 'features'],
    promptExample: 'Create a 25-second app promo for a meditation app showing the clean interface, guided meditation sessions, sleep stories, and a download button overlay.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 12,
  },
  {
    id: 'template_event_announcement_30s',
    name: 'Event Announcement 30s',
    description: 'Announce upcoming events with date, location, speakers, and registration details.',
    category: 'event',
    duration: 30,
    aspectRatio: '1:1',
    tags: ['event', 'announcement', 'registration', 'speakers'],
    promptExample: 'Create a 30-second event announcement for a tech conference featuring speaker highlights, venue shots, date/location information, and a registration link.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 10,
  },
  {
    id: 'template_educational_40s',
    name: 'Educational 40s',
    description: 'Explain complex topics with simple animations, diagrams, and clear voiceover.',
    category: 'education',
    duration: 40,
    aspectRatio: '16:9',
    tags: ['education', 'explainer', 'animated', 'diagrams'],
    promptExample: 'Create a 40-second educational video explaining how solar panels work, using simple animations to show photon absorption, electron flow, and energy conversion.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop',
    isPublic: true,
    creditsRequired: 14,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing templates
  await prisma.template.deleteMany({});
  console.log('🗑️  Cleared existing templates');

  // Create templates
  for (const template of templates) {
    await prisma.template.create({
      data: template,
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  // Create a sample user if none exists
  const existingUser = await prisma.user.findFirst({
    where: { email: 'demo@t4n-ads.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: 'user_demo_123',
        email: 'demo@t4n-ads.com',
        name: 'Demo User',
        credits: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('👤 Created demo user with 100 credits');
  }

  // Create sample videos for the demo user
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo@t4n-ads.com' },
  });

  if (demoUser) {
    const sampleVideos = [
      {
        id: 'video_sample_1',
        userId: demoUser.id,
        title: 'Summer Collection Launch',
        description: 'Promotional video for new summer fashion line',
        prompt: 'Create a vibrant summer fashion ad showing models on a beach at sunset',
        status: 'completed',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
        duration: 15,
        aspectRatio: '9:16',
        style: 'cinematic',
        creditsUsed: 5,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'video_sample_2',
        userId: demoUser.id,
        title: 'Tech Product Demo',
        description: 'Showcasing new wireless headphones features',
        prompt: 'Create a product demo for noise-cancelling headphones showing different use cases',
        status: 'completed',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        duration: 30,
        aspectRatio: '16:9',
        style: 'minimal',
        creditsUsed: 10,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'video_sample_3',
        userId: demoUser.id,
        title: 'Fitness App Testimonial',
        description: 'Customer success story with fitness transformation',
        prompt: 'Create a testimonial video showing weight loss journey using our fitness app',
        status: 'processing',
        videoUrl: null,
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
        duration: 45,
        aspectRatio: '1:1',
        style: 'bold',
        creditsUsed: 15,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await prisma.video.deleteMany({
      where: { userId: demoUser.id },
    });

    for (const video of sampleVideos) {
      await prisma.video.create({
        data: video,
      });
      console.log(`🎬 Created sample video: ${video.title}`);
    }
  }

  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Created ${templates.length} templates`);
  console.log('🔗 Run the app and visit /templates to see the templates');
  console.log('🔗 Visit /gallery to see sample videos');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });