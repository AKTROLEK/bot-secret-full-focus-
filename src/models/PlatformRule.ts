import mongoose, { Schema, Document } from 'mongoose';
import { PlatformRule } from '../types';

export interface IPlatformRule extends Document, PlatformRule {}

const platformRuleSchema = new Schema<IPlatformRule>({
  platform: { type: String, required: true, unique: true },
  minVideosPerWeek: { type: Number, required: true },
  minStreamHoursPerWeek: { type: Number, required: true },
  contentType: { type: String, required: true },
  requirements: [{ type: String }],
});

export const PlatformRule = mongoose.model<IPlatformRule>('PlatformRule', platformRuleSchema);
