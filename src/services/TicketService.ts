import {
  Client,
  GatewayIntentBits,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import { Ticket as TicketModel } from '../models/Ticket';
import { config } from '../config/config';
import logger from '../utils/logger';

export class TicketService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async createTicket(
    userId: string,
    username: string,
    type: string,
    content: string
  ): Promise<string> {
    const ticketId = uuidv4();
    const guild = this.client.guilds.cache.get(config.discord.guildId);

    if (!guild) {
      throw new Error('Guild not found');
    }

    // Create private channel for ticket
    const channel = await guild.channels.create({
      name: `ticket-${username}-${ticketId.substring(0, 8)}`,
      type: ChannelType.GuildText,
      parent: config.channels.ticketCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: config.roles.socialMediaManager,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: config.roles.socialTeam,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: config.roles.streamerManagement,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setTitle(`Ticket: ${type}`)
      .setDescription(content)
      .setColor(0x00ff00)
      .setFooter({ text: `Ticket ID: ${ticketId}` })
      .setTimestamp();

    await (channel as TextChannel).send({ embeds: [embed] });

    await TicketModel.create({
      id: ticketId,
      userId,
      type,
      status: 'open',
      channelId: channel.id,
      content,
      createdAt: new Date(),
    });

    logger.info(`Ticket created: ${ticketId} for user ${userId}`);
    return channel.id;
  }

  async closeTicket(ticketId: string): Promise<void> {
    const ticket = await TicketModel.findOne({ id: ticketId });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    const guild = this.client.guilds.cache.get(config.discord.guildId);
    const channel = guild?.channels.cache.get(ticket.channelId);

    if (channel) {
      await channel.delete();
    }

    logger.info(`Ticket closed: ${ticketId}`);
  }

  async getTicketsByUser(userId: string): Promise<any[]> {
    return TicketModel.find({ userId, status: 'open' }).lean();
  }

  async getAllOpenTickets(): Promise<any[]> {
    return TicketModel.find({ status: 'open' }).lean();
  }
}
