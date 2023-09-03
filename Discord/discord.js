require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const store = require('store2');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const BOT_TOKEN = process.env.BOT_TOKEN; 
const PREFIX = '/pp';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    // Create New User
    if (command === 'createuser') {
      const username = args[1], email = args[3], password = args[5];

      // Call your API to create a new user
      try {
        const response = await axios.post('http://localhost:3000/api/user/signup', {
          username,
          email,
          password
        });

        if (response.status === 201) {
          message.channel.send('User created successfully.');
        } else {
          message.channel.send('Failed to create user.');
        }
      } catch (error) {
          message.channel.send("User Already Exists");
      }
    }

    // Login user
    if (command === 'login') {
      const email = args[1], password = args[3];

      // Call your API to Login user
      try {
        const response = await axios.post('http://localhost:3000/api/user/login', {
          email,
          password
        });
        
        if (response.status === 200) {
          message.channel.send(`Logged In as ${response.data.username}.`);
          store('Profile', {token: response.data.token}); // saving the token
        } 
        else {
          message.channel.send('Failed to Login');
        }
      } catch (error) {
        message.channel.send("Incorrect Username or Password");
      }
    }

    // Create a new service
    else if(command == 'createservice'){
      if(!store('Profile')){
        message.reply({
          content: 'Please login to create a service'
        });
        return;
      }

      const serviceName = args[1], serviceLink = args[3], monthlyFee = args[5].slice(1);
      try {
        const response = await axios.post('http://localhost:3000/api/subscription/create', {
        serviceName,
        serviceLink,
        monthlyFee
      }, { headers: { Authorization : `Bearer ${store('Profile').token}` } });
      message.reply({content: response.data.message})
      } catch (error) {
        console.log(error)
      }
        
    }

    else if(command == 'getuser'){

      if(!store('Profile')){
        message.reply({
          content: 'Please login to to get information'
        });
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/user/profile', 
        { headers: { Authorization : `Bearer ${store('Profile').token}` } });
        const userData = JSON.stringify(response.data[0], null, 2);
        // console.log(userData);
        message.channel.send('Please find your information')
        message.channel.send('```json\n' + userData + '\n```');
      } catch (error) {
        console.log(error)
      }
    }
});

client.login(BOT_TOKEN);
