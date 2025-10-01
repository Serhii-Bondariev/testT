// testt/modules/rssPublisher.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const setupRssPublisher = require('./modules/rssPublisher');
const setupReactionMonitor = require('./modules/reactionMonitor');
const setupTgForwardReader = require('./modules/tgForwardReader');


require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN);



setupRssPublisher(bot);
setupReactionMonitor(bot);
setupTgForwardReader(bot);



bot.launch();
console.log('🤖 Бот запущено');
