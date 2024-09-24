const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Bot is ready
client.once('ready', () => {
    console.log('Bot is online!');
});

// Respond to messages
client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

// Log in to Discord with your token
client.login('YOUR_BOT_TOKEN');

