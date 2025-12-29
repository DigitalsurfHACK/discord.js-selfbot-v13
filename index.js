"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false
});

let isOnline = false;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.username}`);

  if (isOnline) return;
  isOnline = true;

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) return;

  channel.send(
    `🟢 **${client.user.username} is now ONLINE**`
  );
});

client.on("disconnect", async () => {
  if (!isOnline) return;
  isOnline = false;

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (!channel) return;

  channel.send(
    `⚫ **${client.user.username} went OFFLINE**`
  );
});

// Prevent crashes from internal errors
client.on("error", () => {});
client.on("shardError", () => {});

client.login(process.env.TOKEN);
