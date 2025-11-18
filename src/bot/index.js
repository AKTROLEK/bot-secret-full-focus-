import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

// Collections for commands and events
client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, 'commands');
const commandFolders = readdirSync(commandsPath);

const commands = [];

for (const folder of commandFolders) {
  const commandFiles = readdirSync(join(commandsPath, folder)).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = join(commandsPath, folder, file);
    const command = await import(`file://${filePath}`);
    
    if ('data' in command.default && 'execute' in command.default) {
      client.commands.set(command.default.data.name, command.default);
      commands.push(command.default.data.toJSON());
      console.log(`✅ Loaded command: ${command.default.data.name}`);
    } else {
      console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
    }
  }
}

// Load events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = await import(`file://${filePath}`);
  
  if (event.default.once) {
    client.once(event.default.name, (...args) => event.default.execute(...args));
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args));
  }
  
  console.log(`✅ Loaded event: ${event.default.name}`);
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands },
    );

    console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
});

export default client;
