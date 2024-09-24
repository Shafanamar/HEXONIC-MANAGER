const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
});

// Command handler for multiple commands
client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping':
            message.channel.send('Pong!');
            break;
        case 'kick':
            if (!message.member.permissions.has('KICK_MEMBERS')) return;
            const userToKick = message.mentions.users.first();
            if (userToKick) {
                const member = message.guild.members.resolve(userToKick);
                member.kick().then(() => {
                    message.channel.send(`${userToKick.tag} was kicked.`);
                }).catch(err => {
                    message.channel.send('I cannot kick this user.');
                    console.error(err);
                });
            } else {
                message.channel.send('You need to mention a user to kick.');
            }
            break;
        case 'weather':
            if (!args.length) {
                return message.channel.send('Please provide a city name.');
            }
            const city = args.join(' ');
            getWeather(city).then(response => {
                message.channel.send(`The weather in ${city}: ${response.data.weather[0].description}, Temperature: ${response.data.main.temp}°C`);
            }).catch(error => {
                message.channel.send('Unable to get weather data.');
            });
            break;
        case 'help':
            message.channel.send(`Available commands:
            - !ping: Test the bot
            - !kick @user: Kick a mentioned user
            - !weather city_name: Get the current weather in a city`);
            break;
        default:
            message.channel.send('Unknown command. Type `!help` for available commands.');
    }
});

// Function to get weather data from OpenWeatherMap API
async function getWeather(city) {
    const apiKey = process.env.WEATHER_API_KEY; // Use environment variable for API key
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    return axios.get(url);
}

// Log in to Discord using the bot token from the environment variable
client.login(process.env.BOT_TOKEN); // Use environment variable for bot token
