import mongoose, { Schema, Document } from 'mongoose';
import { Challenge, ChallengeRequirement } from '../types';

export interface IChallenge extends Document, Challenge {}

const requirementSchema = new Schema<ChallengeRequirement>({
  type: { type: String, enum: ['videos', 'stream_hours', 'views', 'engagement'], required: true },
  target: { type: Number, required: true },
});

const challengeSchema = new Schema<IChallenge>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleAr: { type: String, required: true },
  description: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  reward: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, enum: ['weekly', 'seasonal'], required: true },
  requirements: [requirementSchema],
});

export const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);
