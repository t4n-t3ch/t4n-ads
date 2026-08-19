import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Ensure a demo user exists to own the seeded templates
  const demoUser = await prisma.user.upsert({
    where: { email: 't4nt3ch@gmail.com' },
    update: {},
    create: {
      email: 't4nt3ch@gmail.com',
      name: 'Demo User',
      credits: 100,
    },
  });
  console.log(`👤 Demo user ready: ${demoUser.email} (${demoUser.credits} credits)`);

  // Clear existing templates
  await prisma.template.deleteMany();
  console.log('🗑️  Cleared existing templates');

  // Create sample templates
  const templates = [
    {
      id: 'template-social-media-15s',
      name: 'Social Media Ad - 15s',
      description: 'Perfect for Instagram, TikTok, and Facebook ads. Quick, engaging, and designed for mobile viewing.',
      category: 'social',
      tags: ['social', 'mobile', 'short'],
      duration: 15,
      aspectRatio: '9:16',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      promptTemplate: 'Create a 15-second social media ad for {product} that highlights {keyFeature}. Use upbeat music, quick cuts, and include a clear call-to-action at the end. Target audience: {audience}.',
      creditsRequired: 5,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-product-demo-30s',
      name: 'Product Demo - 30s',
      description: 'Showcase your product features with clear visuals and explanatory text. Great for landing pages and email campaigns.',
      category: 'product',
      tags: ['product', 'demo', 'explainer'],
      duration: 30,
      aspectRatio: '16:9',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      promptTemplate: 'Create a 30-second product demonstration video for {product}. Show the product in use, highlight {feature1}, {feature2}, and {feature3}. Include text overlays explaining key benefits. End with pricing and website.',
      creditsRequired: 10,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-testimonial-45s',
      name: 'Customer Testimonial - 45s',
      description: 'Build trust with authentic customer stories. Includes interview-style footage and text highlights.',
      category: 'testimonial',
      tags: ['testimonial', 'trust', 'interview'],
      duration: 45,
      aspectRatio: '16:9',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      promptTemplate: 'Create a 45-second customer testimonial video for {company}. Include a customer talking about their positive experience, text overlays with key quotes, and shots of the product/service in use. Focus on solving {problem}.',
      creditsRequired: 15,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-brand-story-60s',
      name: 'Brand Story - 60s',
      description: 'Tell your brand story with emotional appeal and cinematic visuals. Perfect for brand awareness campaigns.',
      category: 'brand',
      tags: ['brand', 'story', 'cinematic'],
      duration: 60,
      aspectRatio: '16:9',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      promptTemplate: 'Create a 60-second brand story video for {brand}. Start with the problem, show the journey, highlight the solution, and end with the vision. Use cinematic shots, emotional music, and include the tagline: {tagline}.',
      creditsRequired: 20,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-event-promo-20s',
      name: 'Event Promo - 20s',
      description: 'Promote your event with urgency and excitement. Includes date, location, and registration details.',
      category: 'event',
      tags: ['event', 'promo', 'urgent'],
      duration: 20,
      aspectRatio: '1:1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      promptTemplate: 'Create a 20-second event promotion video for {eventName}. Show the venue, speakers/performers, and highlight key attractions. Include text overlays with date: {date}, location: {location}, and website: {website}. Create urgency with "Limited tickets available!".',
      creditsRequired: 8,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-explainer-40s',
      name: 'Explainer Video - 40s',
      description: 'Explain complex concepts simply with animated graphics and clear narration. Ideal for SaaS and tech products.',
      category: 'explainer',
      tags: ['explainer', 'animated', 'educational'],
      duration: 40,
      aspectRatio: '16:9',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      promptTemplate: 'Create a 40-second explainer video about {topic}. Use simple animations to illustrate {concept1}, {concept2}, and {concept3}. Include a friendly voiceover explaining each step. End with a summary and next steps.',
      creditsRequired: 12,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-holiday-sale-25s',
      name: 'Holiday Sale - 25s',
      description: 'Boost holiday sales with festive visuals, limited-time offers, and gift ideas.',
      category: 'sale',
      tags: ['holiday', 'sale', 'festive'],
      duration: 25,
      aspectRatio: '9:16',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      promptTemplate: 'Create a 25-second holiday sale video for {store}. Show festive decorations, popular products as gifts, and highlight the discount: {discount}. Include text overlays with "Limited time offer!" and "Free shipping on orders over {amount}".',
      creditsRequired: 9,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'template-app-promo-35s',
      name: 'App Promo - 35s',
      description: 'Showcase your app features with screen recordings and user testimonials.',
      category: 'app',
      tags: ['app', 'mobile', 'screens'],
      duration: 35,
      aspectRatio: '9:16',
      thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop',
      previewUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      promptTemplate: 'Create a 35-second app promotion video for {appName}. Show screen recordings of {feature1}, {feature2}, and {feature3}. Include user testimonials as text overlays. End with app store badges and a call to download.',
      creditsRequired: 13,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Insert templates
  for (const template of templates) {
    const { tags, promptTemplate, creditsRequired, ...rest } = template;
    await prisma.template.create({
      data: {
        ...rest,
        tags: tags.join(','),
        userId: demoUser.id,
        config: { promptTemplate, creditsRequired },
      },
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  console.log('🎉 Database seeding completed!');
  console.log(`📊 Created ${templates.length} templates across 7 categories:`);
  console.log('   • Social Media (15s)');
  console.log('   • Product Demo (30s)');
  console.log('   • Testimonial (45s)');
  console.log('   • Brand Story (60s)');
  console.log('   • Event Promo (20s)');
  console.log('   • Explainer (40s)');
  console.log('   • Holiday Sale (25s)');
  console.log('   • App Promo (35s)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });