import mongoose, { Schema, Document } from 'mongoose';
import { Reward } from '../types';

export interface IReward extends Document, Reward {}

const rewardSchema = new Schema<IReward>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  cost: { type: Number, required: true },
  category: {
    type: String,
    enum: ['rank', 'promotion', 'service', 'gift', 'tools', 'coaching'],
    required: true,
  },
  available: { type: Boolean, default: true },
});

export const Reward = mongoose.model<IReward>('Reward', rewardSchema);
