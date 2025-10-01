// testt/modules/rssPublisher.js
const Parser = require('rss-parser');
const axios = require('axios');
const iconv = require('iconv-lite');

const parser = new Parser();

// 🔁 Можеш додати свої джерела з відповідним кодуванням
const rssFeeds = [
  { url: 'https://www.pravda.com.ua/rss/', encoding: 'win1251' },

  { url: 'https://rss.unian.ua/site/news_ukr.rss', encoding: 'utf8' },
];


let lastLinks = new Set();

async function fetchFeed(url, encoding = 'utf8') {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const decodedText = iconv.decode(response.data, encoding);

    return await parser.parseString(decodedText);
  } catch (err) {
    console.error(`❌ Помилка при отриманні RSS ${url}:`, err.message);
    return null;
  }
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAndSend(bot) {
  for (const feedSource of rssFeeds) {
    const { url, encoding } = feedSource;
    const feed = await fetchFeed(url, encoding);

    if (!feed) continue;

    for (const item of feed.items.reverse()) {
      if (!lastLinks.has(item.link)) {
        const message = `📰 <b>${item.title}</b>\n\n${item.link}`;

        try {
          await bot.telegram.sendMessage(process.env.GROUP_ID, message, { parse_mode: 'HTML' });
          await delay(15000); // не спамити
        } catch (err) {
          console.error('❌ Не вдалося надіслати повідомлення:', err.message);
          if (err.parameters?.retry_after) {
            const wait = (err.parameters.retry_after + 1) * 30000;
            console.log(`⏳ Очікування ${wait / 30000} сек через обмеження Telegram...`);
            await delay(wait);
          }
        }

        lastLinks.add(item.link);
        if (lastLinks.size > 30000) {
          lastLinks = new Set(Array.from(lastLinks).slice(-35000));
        }
      }
    }
  }
}

// 🟢 Запускаємо при імпорті
module.exports = (bot) => {
  fetchAndSend(bot);
  setInterval(() => fetchAndSend(bot), 5 * 60 * 1000);
};



// async function fetchAndSend(bot) {
//   for (const feedSource of rssFeeds) {
//     const { url, encoding } = feedSource;
//     const feed = await fetchFeed(url, encoding);

//     if (!feed) continue;

//     for (const item of feed.items.reverse()) {
//       if (!lastLinks.has(item.link)) {
//         const message = `📰 <b>${item.title}</b>\n\n${item.link}`;
//         await bot.telegram.sendMessage(process.env.GROUP_ID, message, { parse_mode: 'HTML' });
//         lastLinks.add(item.link);

//         if (lastLinks.size > 1000) {
//           lastLinks = new Set(Array.from(lastLinks).slice(-500));
//         }
//       }
//     }
//   }
// }

// module.exports = (bot) => {
//   fetchAndSend(bot);
//   setInterval(() => fetchAndSend(bot), 5 * 60 * 1000);
// };
//testt/modules/rssPublisher



// const axios = require('axios');
// const iconv = require('iconv-lite');
// const Parser = require('rss-parser');
// const parser = new Parser();

// const rssFeeds = [
//   'https://www.pravda.com.ua/rss/',
//   'https://rss.unian.ua/site/news_ukr.rss',
//   // 'https://www.radiosvoboda.org/z/630',
//   'https://www.bbc.com/ukrainian/index.xml'
// ];

// let lastLinks = new Set();

// async function fetchAndSend(bot) {
//   for (const url of rssFeeds) {
//     try {
//       const response = await axios.get(url, {
//         responseType: 'arraybuffer',
//       });

//       // Декодуємо тіло як windows-1251
//       const decodedBody = iconv.decode(response.data, 'windows-1251');

//       // Парсимо розкодований текст
//       const feed = await parser.parseString(decodedBody);

//       for (const item of feed.items.reverse()) {
//         if (!lastLinks.has(item.link)) {
//           await bot.telegram.sendMessage(
//             process.env.GROUP_ID,
//             `📰 <b>${item.title}</b>\n\n${item.link}`,
//             { parse_mode: 'HTML' }
//           );
//           lastLinks.add(item.link);
//           if (lastLinks.size > 1000)
//             lastLinks = new Set(Array.from(lastLinks).slice(-500));
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
