"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false
});

const USER_ID = process.env.USER_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

let isOnline = false;

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.username}`);

  if (isOnline) return;
  isOnline = true;

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) return;

  channel.send(
    `🟢 **User Online**\n<@${USER_ID}> is now **ONLINE**`
  );
});

client.on("disconnect", async () => {
  if (!isOnline) return;
  isOnline = false;

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) return;

  channel.send(
    `⚫ **User Offline**\n<@${USER_ID}> is now **OFFLINE**`
  );
});

// Prevent Railway crash loops
client.on("error", () => {});
client.on("shardError", () => {});
client.on("warn", () => {});

client.login(process.env.TOKEN);
