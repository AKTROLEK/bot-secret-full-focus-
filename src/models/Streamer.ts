import mongoose, { Schema, Document } from 'mongoose';
import { StreamerProfile, StreamerStatistics, ScheduleEntry } from '../types';

export interface IStreamer extends Document, StreamerProfile {}

const scheduleSchema = new Schema<ScheduleEntry>({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  platform: { type: String, required: true },
});

const statisticsSchema = new Schema<StreamerStatistics>({
  totalVideos: { type: Number, default: 0 },
  totalStreamHours: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  weeklyVideos: { type: Number, default: 0 },
  weeklyStreamHours: { type: Number, default: 0 },
  monthlyVideos: { type: Number, default: 0 },
  monthlyStreamHours: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
});

const streamerSchema = new Schema<IStreamer>(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    platforms: {
      youtube: String,
      twitch: String,
      tiktok: String,
      kick: String,
      instagram: String,
      facebook: String,
    },
    credits: { type: Number, default: 0 },
    schedule: [scheduleSchema],
    statistics: { type: statisticsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Streamer = mongoose.model<IStreamer>('Streamer', streamerSchema);
