const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`);
});

client.login(process.env.TOKEN);
