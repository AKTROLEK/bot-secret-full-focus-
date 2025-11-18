import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed Platform Rules
  console.log('📜 Creating platform rules...');
  
  const platforms = [
    {
      platform: 'youtube',
      weeklyVideosRequired: 3,
      weeklyStreamHoursRequired: 10,
      contentGuidelinesEn: 'Create high-quality gaming content. Follow YouTube Community Guidelines. Include channel watermark. Post at least 3 videos per week or stream 10+ hours.',
      contentGuidelinesAr: 'إنشاء محتوى ألعاب عالي الجودة. اتبع إرشادات مجتمع يوتيوب. أضف علامة مائية للقناة. انشر 3 مقاطع على الأقل أسبوعياً أو بث 10+ ساعات.',
    },
    {
      platform: 'twitch',
      weeklyVideosRequired: 0,
      weeklyStreamHoursRequired: 15,
      contentGuidelinesEn: 'Stream at least 15 hours per week. Maintain consistent schedule. Interact with viewers. Follow Twitch TOS.',
      contentGuidelinesAr: 'بث 15 ساعة على الأقل أسبوعياً. حافظ على جدول ثابت. تفاعل مع المشاهدين. اتبع شروط خدمة تويتش.',
    },
    {
      platform: 'tiktok',
      weeklyVideosRequired: 5,
      weeklyStreamHoursRequired: 5,
      contentGuidelinesEn: 'Post 5 short-form videos weekly. Keep videos under 3 minutes. Use trending sounds. Engage with comments.',
      contentGuidelinesAr: 'انشر 5 مقاطع قصيرة أسبوعياً. اجعل المقاطع أقل من 3 دقائق. استخدم الأصوات الرائجة. تفاعل مع التعليقات.',
    },
    {
      platform: 'kick',
      weeklyVideosRequired: 0,
      weeklyStreamHoursRequired: 12,
      contentGuidelinesEn: 'Stream 12+ hours weekly. Maintain high engagement. Follow Kick guidelines.',
      contentGuidelinesAr: 'بث 12+ ساعة أسبوعياً. حافظ على تفاعل عالي. اتبع إرشادات كيك.',
    },
    {
      platform: 'instagram',
      weeklyVideosRequired: 4,
      weeklyStreamHoursRequired: 3,
      contentGuidelinesEn: 'Post 4 Reels per week or stream 3 hours. Use relevant hashtags. Follow Instagram Community Guidelines.',
      contentGuidelinesAr: 'انشر 4 ريلز أسبوعياً أو بث 3 ساعات. استخدم هاشتاجات ذات صلة. اتبع إرشادات مجتمع انستقرام.',
    },
    {
      platform: 'facebook',
      weeklyVideosRequired: 2,
      weeklyStreamHoursRequired: 8,
      contentGuidelinesEn: 'Post 2 gaming videos weekly or stream 8+ hours. Engage with Facebook Gaming community.',
      contentGuidelinesAr: 'انشر مقطعي ألعاب أسبوعياً أو بث 8+ ساعات. تفاعل مع مجتمع فيسبوك جيمنج.',
    },
  ];

  for (const platformData of platforms) {
    await prisma.platformRule.upsert({
      where: { platform: platformData.platform },
      update: platformData,
      create: platformData,
    });
  }

  console.log('✅ Platform rules created');

  // Seed Sample Rewards
  console.log('🎁 Creating sample rewards...');

  const rewards = [
    {
      nameEn: 'VIP Role',
      nameAr: 'رتبة VIP',
      descriptionEn: 'Get the exclusive VIP role with special permissions and channel access.',
      descriptionAr: 'احصل على رتبة VIP الحصرية مع صلاحيات خاصة ووصول للقنوات المميزة.',
      cost: 500,
      category: 'rank_upgrade',
      isAvailable: true,
      stock: null,
    },
    {
      nameEn: 'Video Promotion',
      nameAr: 'ترويج فيديو',
      descriptionEn: 'Get your video promoted in our announcement channel and social media.',
      descriptionAr: 'احصل على ترويج لفيديوك في قناة الإعلانات ووسائل التواصل الاجتماعي.',
      cost: 300,
      category: 'promotion',
      isAvailable: true,
      stock: null,
    },
    {
      nameEn: 'Professional Video Editing',
      nameAr: 'مونتاج احترافي',
      descriptionEn: 'Get one video professionally edited by our team (up to 10 minutes).',
      descriptionAr: 'احصل على مونتاج احترافي لفيديو واحد من فريقنا (حتى 10 دقائق).',
      cost: 800,
      category: 'editing',
      isAvailable: true,
      stock: 10,
    },
    {
      nameEn: '$10 Steam Gift Card',
      nameAr: 'قيفت كارد Steam بـ $10',
      descriptionEn: 'Redeem for a $10 Steam gift card.',
      descriptionAr: 'استبدل بقيفت كارد Steam بقيمة $10.',
      cost: 1000,
      category: 'gift_card',
      isAvailable: true,
      stock: 5,
    },
    {
      nameEn: 'Streaming Software License',
      nameAr: 'ترخيص برنامج بث',
      descriptionEn: 'Get a premium streaming software license (OBS plugins, StreamElements, etc.).',
      descriptionAr: 'احصل على ترخيص برنامج بث مميز (إضافات OBS، StreamElements، إلخ).',
      cost: 1500,
      category: 'tools',
      isAvailable: true,
      stock: 3,
    },
    {
      nameEn: '1-Hour Coaching Session',
      nameAr: 'جلسة تدريب ساعة واحدة',
      descriptionEn: 'One-on-one coaching session with an experienced streamer to improve your content.',
      descriptionAr: 'جلسة تدريب فردية مع ستريمر محترف لتحسين محتواك.',
      cost: 2000,
      category: 'coaching',
      isAvailable: true,
      stock: 2,
    },
  ];

  for (const rewardData of rewards) {
    await prisma.reward.create({
      data: rewardData,
    });
  }

  console.log('✅ Sample rewards created');

  // Seed System Settings
  console.log('⚙️ Creating system settings...');

  const settings = [
    { key: 'bot_version', value: '1.0.0' },
    { key: 'credit_per_video', value: '50' },
    { key: 'credit_per_stream_hour', value: '20' },
    { key: 'credit_per_1000_views', value: '10' },
    { key: 'weekly_goal_bonus', value: '200' },
    { key: 'inactivity_warning_days', value: '7' },
    { key: 'default_language', value: 'ar' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ System settings created');

  console.log('');
  console.log('✨ Database seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`  - ${platforms.length} Platform Rules`);
  console.log(`  - ${rewards.length} Sample Rewards`);
  console.log(`  - ${settings.length} System Settings`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
