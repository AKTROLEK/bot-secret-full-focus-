import mongoose, { Schema, Document } from 'mongoose';
import { Ticket } from '../types';

export interface ITicket extends Document, Ticket {}

const ticketSchema = new Schema<ITicket>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['application', 'issue', 'credit_request', 'promotion', 'support'],
      required: true,
    },
    status: { type: String, enum: ['open', 'closed', 'in_progress'], default: 'open' },
    channelId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    closedAt: Date,
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
