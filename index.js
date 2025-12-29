"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false
});

let lastStatus = null;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.username}`);

  // initial status
  lastStatus = client.user.presence?.status ?? "offline";

  setInterval(async () => {
    try {
      // force presence refresh
      const me = await client.users.fetch(client.user.id, { force: true });
      const newStatus = me.presence?.status ?? "offline";

      if (newStatus === lastStatus) return;

      console.log(`Status changed: ${lastStatus} → ${newStatus}`);
      lastStatus = newStatus;

      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      if (!channel?.send) return;

      const statusText = {
        online: "🟢 ONLINE",
        idle: "🌙 IDLE",
        dnd: "⛔ DND",
        offline: "⚫ OFFLINE"
      };

      await channel.send(
        `📡 **Status Update**\n<@${client.user.id}> is now **${statusText[newStatus] || newStatus}**`
      );

    } catch (err) {
      console.error("Status check failed:", err.message);
    }
  }, 15000); // check every 15 seconds
});

client.login(process.env.TOKEN);
