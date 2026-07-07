import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 100, default: 75 },
  },
  { _id: false }
);

const techCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'database', 'tools', 'languages'],
    },
    label: { type: String, required: true, trim: true },
    emoji: { type: String, default: '🚀' },
    color: { type: String, default: 'from-primary/10 to-accent/10' },
    borderColor: { type: String, default: 'hover:border-primary/20' },
    skills: { type: [skillSchema], default: [] },
  },
  { _id: false }
);

const techStackSchema = new mongoose.Schema(
  {
    // Singleton document — always one TechStack document
    categories: { type: [techCategorySchema], default: [] },
  },
  { timestamps: true }
);

const TechStack = mongoose.model('TechStack', techStackSchema);
export default TechStack;
