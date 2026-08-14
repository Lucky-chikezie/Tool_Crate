require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Tool = require('../models/Tool');

const demoTools = [
  { name: 'Futurepedia', description: 'Directory of AI tools across categories', category: 'directory', link: 'https://www.futurepedia.io/' },
  { name: 'ChatFlow', description: 'Conversational AI assistant for customer support', category: 'chatbot', link: 'https://example.com/chatflow' },
  { name: 'PixelMuse', description: 'AI image generation from text prompts', category: 'image', link: 'https://example.com/pixelmuse' },
  { name: 'CodeSprint', description: 'AI pair programmer for fast code completion', category: 'coding', link: 'https://example.com/codesprint' },
  { name: 'VoiceCraft', description: 'Text to natural sounding voice synthesis', category: 'audio', link: 'https://example.com/voicecraft' },
  { name: 'SnapDraw', description: 'Sketch to image AI art generator', category: 'image', link: 'https://example.com/snapdraw' },
  { name: 'BugHunter AI', description: 'Automated code review and bug detection', category: 'coding', link: 'https://example.com/bughunter' },
  { name: 'SupportBot', description: 'AI chatbot for handling support tickets', category: 'chatbot', link: 'https://example.com/supportbot' },
];

async function seed() {
  await connectDB();

  let demoUser = await User.findOne({ email: 'demo@toolcrate.dev' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@toolcrate.dev',
      password: 'password123',
    });
    console.log('Created demo user: demo@toolcrate.dev / password123');
  }

  await Tool.deleteMany({});

  const created = await Tool.insertMany(
    demoTools.map((t) => ({
      ...t,
      submittedBy: demoUser._id,
      upvoteCount: Math.floor(Math.random() * 15),
    }))
  );

  console.log(`Seeded ${created.length} tools.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});