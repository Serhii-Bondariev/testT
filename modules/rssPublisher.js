//testt/modules/rssPublisher

const axios = require('axios');
const iconv = require('iconv-lite');
const Parser = require('rss-parser');
const parser = new Parser();

const rssFeeds = [
  'https://www.pravda.com.ua/rss/',
  'https://rss.unian.ua/site/news_ukr.rss',
  // 'https://www.radiosvoboda.org/z/630',
  'https://www.bbc.com/ukrainian/index.xml',
  'https://rss.unian.ua/site/news_ukr.rss',
];

let lastLinks = new Set();

async function fetchAndSend(bot) {
  for (const url of rssFeeds) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      // Декодуємо тіло як windows-1251
      const decodedBody = iconv.decode(response.data, 'windows-1251');

      // Парсимо розкодований текст
      const feed = await parser.parseString(decodedBody);

      for (const item of feed.items.reverse()) {
        if (!lastLinks.has(item.link)) {
          await bot.telegram.sendMessage(
            process.env.GROUP_ID,
            `📰 <b>${item.title}</b>\n\n${item.link}`,
            { parse_mode: 'HTML' }
          );
          lastLinks.add(item.link);
          if (lastLinks.size > 1000)
            lastLinks = new Set(Array.from(lastLinks).slice(-500));
        }
      }
    } catch (err) {
      console.error('❌ Помилка при отриманні RSS:', err.message);
    }
  }
}

module.exports = (bot) => {
  fetchAndSend(bot);
  setInterval(() => fetchAndSend(bot), 5 * 60 * 1000);
};


// const Parser = require('rss-parser');
// const parser = new Parser();

// const rssFeeds = [
//   'https://www.pravda.com.ua/rss/',
// ];

// let lastLinks = new Set();

// async function fetchAndSend(bot) {
//   for (const url of rssFeeds) {
//     try {
//       const feed = await parser.parseURL(url);
//       for (const item of feed.items.reverse()) {
//         if (!lastLinks.has(item.link)) {
//           await bot.telegram.sendMessage(process.env.GROUP_ID, `📰 <b>${item.title}</b>\n\n${item.link}`, {
//             parse_mode: 'HTML'
//           });
//           lastLinks.add(item.link);
//           if (lastLinks.size > 1000) lastLinks = new Set(Array.from(lastLinks).slice(-500));
//         }
//       }
//     } catch (err) {
//       console.error('❌ Помилка при отриманні RSS:', err.message);
//     }
//   }
// }

// module.exports = (bot) => {
//   fetchAndSend(bot);
//   setInterval(() => fetchAndSend(bot), 5 * 60 * 1000);
// };
