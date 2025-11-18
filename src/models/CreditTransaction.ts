import mongoose, { Schema, Document } from 'mongoose';
import { CreditTransaction } from '../types';

export interface ICreditTransaction extends Document, CreditTransaction {}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['earn', 'spend', 'admin_add', 'admin_remove', 'transfer'],
      required: true,
    },
    reason: { type: String, required: true },
    fromUser: String,
    toUser: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CreditTransaction = mongoose.model<ICreditTransaction>(
  'CreditTransaction',
  creditTransactionSchema
);
