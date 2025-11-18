export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Full Streamer System Bot is Ready!');
    console.log(`🤖 Logged in as: ${client.user.tag}`);
    console.log(`🌐 Serving ${client.guilds.cache.size} guild(s)`);
    console.log(`👥 Watching ${client.users.cache.size} user(s)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Set bot status
    client.user.setPresence({
      activities: [{ 
        name: '🎥 Streamers | /help',
        type: 3 // Watching
      }],
      status: 'online',
    });
  },
};
