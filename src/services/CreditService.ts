import { Streamer } from '../models/Streamer';
import { CreditTransaction } from '../models/CreditTransaction';
import logger from '../utils/logger';

export class CreditService {
  static async getBalance(userId: string): Promise<number> {
    const streamer = await Streamer.findOne({ userId });
    return streamer?.credits || 0;
  }

  static async addCredits(
    userId: string,
    amount: number,
    reason: string,
    type: 'earn' | 'admin_add' = 'earn'
  ): Promise<number> {
    const streamer = await Streamer.findOneAndUpdate(
      { userId },
      { $inc: { credits: amount } },
      { new: true, upsert: true }
    );

    await CreditTransaction.create({
      userId,
      amount,
      type,
      reason,
      timestamp: new Date(),
    });

    logger.info(`Added ${amount} credits to user ${userId}. Reason: ${reason}`);
    return streamer.credits;
  }

  static async removeCredits(
    userId: string,
    amount: number,
    reason: string,
    type: 'spend' | 'admin_remove' = 'spend'
  ): Promise<number> {
    const streamer = await Streamer.findOne({ userId });
    if (!streamer || streamer.credits < amount) {
      throw new Error('Insufficient credits');
    }

    streamer.credits -= amount;
    await streamer.save();

    await CreditTransaction.create({
      userId,
      amount: -amount,
      type,
      reason,
      timestamp: new Date(),
    });

    logger.info(`Removed ${amount} credits from user ${userId}. Reason: ${reason}`);
    return streamer.credits;
  }

  static async transferCredits(
    fromUserId: string,
    toUserId: string,
    amount: number
  ): Promise<void> {
    const fromStreamer = await Streamer.findOne({ userId: fromUserId });
    if (!fromStreamer || fromStreamer.credits < amount) {
      throw new Error('Insufficient credits');
    }

    await Streamer.findOneAndUpdate({ userId: fromUserId }, { $inc: { credits: -amount } });
    await Streamer.findOneAndUpdate(
      { userId: toUserId },
      { $inc: { credits: amount } },
      { upsert: true }
    );

    await CreditTransaction.create({
      userId: fromUserId,
      amount: -amount,
      type: 'transfer',
      reason: `Transfer to ${toUserId}`,
      fromUser: fromUserId,
      toUser: toUserId,
      timestamp: new Date(),
    });

    await CreditTransaction.create({
      userId: toUserId,
      amount,
      type: 'transfer',
      reason: `Transfer from ${fromUserId}`,
      fromUser: fromUserId,
      toUser: toUserId,
      timestamp: new Date(),
    });

    logger.info(`Transferred ${amount} credits from ${fromUserId} to ${toUserId}`);
  }

  static async getTransactionHistory(userId: string, limit = 50): Promise<any[]> {
    return CreditTransaction.find({ userId }).sort({ timestamp: -1 }).limit(limit).lean();
  }
}
