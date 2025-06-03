// testt/modules/tgForwardReader.js
const fs = require('fs');
const path = require('path');

// Завантаження списку дозволених каналів
const channels = JSON.parse(fs.readFileSync(path.join(__dirname, '../channels.json'), 'utf8'));

function setupTgForwardReader(bot) {
  bot.on('message', async (ctx) => {
    const msg = ctx.message;

    if (msg.forward_from_chat && channels.includes(msg.forward_from_chat.username)) {
      const channel = msg.forward_from_chat.username;
      const caption = msg.caption || msg.text || '<без тексту>';

      console.log('🔁 Forwarded from:', channel);
      console.log('✅ Дозволений канал. Публікуємо...');

      try {
        if (msg.video) {
          await ctx.telegram.sendVideo(process.env.GROUP_ID, msg.video.file_id, {
            caption: `📰 З @${channel}:\n\n${caption}`,
            parse_mode: 'HTML',
          });
        } else if (msg.photo) {
          const photo = msg.photo[msg.photo.length - 1]; // найвища якість
          await ctx.telegram.sendPhoto(process.env.GROUP_ID, photo.file_id, {
            caption: `📰 З @${channel}:\n\n${caption}`,
            parse_mode: 'HTML',
          });
        } else if (msg.document) {
          await ctx.telegram.sendDocument(process.env.GROUP_ID, msg.document.file_id, {
            caption: `📰 З @${channel}:\n\n${caption}`,
            parse_mode: 'HTML',
          });
        } else if (msg.text) {
          await ctx.telegram.sendMessage(process.env.GROUP_ID, `📰 З @${channel}:\n\n${caption}`, {
            parse_mode: 'HTML',
          });
        } else {
          console.log('⚠️ Невідомий тип контенту. Не обробляємо.');
        }
      } catch (err) {
        console.error('❌ Помилка при публікації:', err.message);
      }
    }
  });
}


module.exports = setupTgForwardReader;
// Цей модуль читає переслані повідомлення з дозволених каналів