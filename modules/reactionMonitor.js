const suspicious = ['😂', '🤣', '😹'];
const safe = ['❤️', '🙏', '😢'];

module.exports = (bot) => {
  bot.on('message_reaction', async (ctx) => {
    try {
      const reaction = ctx.update.message_reaction;
      if (!reaction) return;

      const { emoji, from, message_id, chat } = reaction;
      const suspicious = ['😂', '🤣', '😹'];

      if (suspicious.includes(emoji)) {
        const messageLink = `https://t.me/c/${String(chat.id).replace('-100', '')}/${message_id}`;
        const report = `🚨 <b>Провокатор!</b>\n👤 <a href="tg://user?id=${from.id}">${from.first_name}</a>\nРеакція: ${emoji}\n🔗 [Переглянути повідомлення](${messageLink})`;
        await bot.telegram.sendMessage(process.env.ADMIN_ID, report, { parse_mode: 'HTML', disable_web_page_preview: true });
      }
    } catch (err) {
      console.error('❌ Помилка обробки реакції:', err.message);
    }
  });
};
