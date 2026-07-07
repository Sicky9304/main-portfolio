import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    problem: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    tech: {
      type: [String],
      required: [true, 'At least one technology is required'],
    },
    github: {
      type: String,
      default: '',
    },
    demo: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'from-primary to-secondary',
    },
    emoji: {
      type: String,
      default: '🚀',
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planned'],
      default: 'Completed',
    },
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    challenges: {
      type: String,
      default: '',
    },
    architecture: {
      type: String,
      default: '',
    },
    results: {
      type: String,
      default: '',
    },
    codeSnippet: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ order: 1 });
projectSchema.index({ featured: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
