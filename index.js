"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false
});

let lastStatus = null;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.username}`);
  lastStatus = client.user.presence?.status ?? "offline";
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence?.userId) return;
  if (newPresence.userId !== client.user.id) return;

  const newStatus = newPresence.status;
  if (newStatus === lastStatus) return;

  lastStatus = newStatus;

  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel?.send) return;

    const statusText = {
      online: "🟢 **ONLINE**",
      idle: "🌙 **IDLE**",
      dnd: "⛔ **DO NOT DISTURB**",
      offline: "⚫ **OFFLINE**"
    };

    await channel.send(
      ` **Status Update**\n<@${client.user.id}> is now ${statusText[newStatus] || newStatus}`
    );

    console.log("Status changed →", newStatus);
  } catch (err) {
    console.error("Send failed:", err.message);
  }
});

client.login(process.env.TOKEN);
