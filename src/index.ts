import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { config } from './config/config';
import logger from './utils/logger';
import { TicketService } from './services/TicketService';
import { AnalyticsService } from './services/AnalyticsService';
import { CreditService } from './services/CreditService';
import { NotificationService } from './services/NotificationService';
import { initializeDefaultData } from './services/SetupService';

// Extend Client type to include commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
    ticketService: TicketService;
    notificationService: NotificationService;
  }
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.ticketService = new TicketService(client);
client.notificationService = new NotificationService(client);

// Load commands
const loadCommands = () => {
  const commands: any[] = [];
  const commandFolders = ['general', 'streamer', 'admin'];

  for (const folder of commandFolders) {
    const commandsPath = path.join(__dirname, 'commands', folder);
    if (!fs.existsSync(commandsPath)) continue;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath).default;

      if (command && command.data) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        logger.info(`Loaded command: ${command.data.name}`);
      }
    }
  }

  return commands;
};

// Register slash commands
const registerCommands = async (commands: any[]) => {
  const rest = new REST({ version: '10' }).setToken(config.discord.token);

  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), {
      body: commands,
    });

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Error registering commands:', error);
  }
};

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Setup Express API for dashboard
const setupAPI = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Get streamer data
  app.get('/api/streamer/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const balance = await CreditService.getBalance(userId);
      const stats = await AnalyticsService.getTotalStats(userId);
      res.json({ balance, stats });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get leaderboard
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const period = (req.query.period as 'week' | 'month') || 'week';
      const leaderboard = await AnalyticsService.getTopStreamers(10, period);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.listen(config.server.port, () => {
    logger.info(`API server running on port ${config.server.port}`);
  });
};

// Setup cron jobs
const setupCronJobs = () => {
  // Reset weekly stats every Monday at 00:00
  cron.schedule('0 0 * * 1', async () => {
    logger.info('Running weekly stats reset');
    await AnalyticsService.resetWeeklyStats();
  });

  // Reset monthly stats on the 1st of every month at 00:00
  cron.schedule('0 0 1 * *', async () => {
    logger.info('Running monthly stats reset');
    await AnalyticsService.resetMonthlyStats();
  });

  // Check streaming requirements every Sunday at 20:00
  cron.schedule('0 20 * * 0', async () => {
    logger.info('Checking streaming requirements');
    await client.notificationService.checkStreamingRequirements();
  });

  logger.info('Cron jobs scheduled');
};

// Event handlers
client.once('ready', async () => {
  logger.info(`Logged in as ${client.user?.tag}`);

  // Initialize default data
  await initializeDefaultData();

  const commands = loadCommands();
  await registerCommands(commands);
  setupCronJobs();
  setupAPI();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client.ticketService);
  } catch (error) {
    logger.error('Error executing command:', error);
    const reply = {
      content: 'There was an error executing this command!',
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// Start bot
const start = async () => {
  await connectDatabase();
  await client.login(config.discord.token);
};

start().catch(error => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});

export default client;
