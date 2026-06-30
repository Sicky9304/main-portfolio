import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String,
      required: [true, 'Icon name is required'],
      default: 'Zap',
    },
    gradient: {
      type: String,
      default: 'from-primary to-secondary',
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

serviceSchema.index({ order: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
