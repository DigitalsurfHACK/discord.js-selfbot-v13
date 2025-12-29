"use strict";

const process = require("node:process");
const { Client } = require("./src/index.js");

const client = new Client({
  checkUpdate: false
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.username}`);
});

client.login(process.env.TOKEN);
