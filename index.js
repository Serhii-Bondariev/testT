// testt/modules/rssPublisher.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const setupRssPublisher = require('./modules/rssPublisher');
const setupReactionMonitor = require('./modules/reactionMonitor');
const setupTgForwardReader = require('./modules/tgForwardReader');


require('dotenv').config();

// const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.on('message', (ctx) => {
//   console.log('📣 Chat ID:', ctx.chat.id);
//   console.log('👤 User ID:', ctx.from.id);

//   ctx.reply(`✅ Отримано ID:\nChat ID: ${ctx.chat.id}\nUser ID: ${ctx.from.id}`);
// });

// bot.launch();
// console.log('🤖 Бот запущено');



const bot = new Telegraf(process.env.BOT_TOKEN);

setupRssPublisher(bot);
setupReactionMonitor(bot);
setupTgForwardReader(bot);



bot.launch();
console.log('🤖 Бот запущено');
