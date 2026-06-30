import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required'],
    },
    avatar: {
      type: String,
      default: '👤',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
