const config = require('../config');
const store = require('../lib/store');

module.exports = {
  name: 'menu',
  aliases: ['help', 'start'],
  description: 'Tampilkan daftar perintah',
  run: async (ctx) => {
    const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix];
    const p = prefixes[0];

    let storeName = '';
    if (ctx.isGroup) {
      const cfg = store.getConfig(ctx.from);
      if (cfg.name) storeName = `\n_Toko:_ *${cfg.name}*`;
    }

    const text = `
*${config.botName}*${storeName}
_Prefix:_ ${prefixes.map(x => '*' + x + '*').join(' | ')}

╭────〔 GROUP 〕─
┊・ ${p}open
┊・ ${p}close
┊・ ${p}disable
┊・ ${p}enable
┊・ ${p}revoke
┊・ ${p}setautoclose <durasi|off>
┊・ ${p}setdeskgc <teks>
┊・ ${p}setnamegc <nama>
┊・ ${p}setppgc   (reply gambar)
┊・ ${p}add <nomor>
┊・ ${p}demote @user
┊・ ${p}kick   @user
┊・ ${p}promote @user
┊・ ${p}tagall [pesan]
┊・ ${p}antilink on|off
╰┈┈┈┈┈┈┈┈

╭────〔 STORE 〕─
┊・ ${p}setname <nama>        (alias setnamestore)
┊・ ${p}setnamestore <nama>
┊・ ${p}setlogostore          (reply gambar)
┊・ ${p}dellogostore
┊・ ${p}addlist <teks>
┊・ ${p}updatelist <id> <teks>
┊・ ${p}deletelist <id>
┊・ ${p}deletestore confirm
┊・ ${p}list                   (alias setlist)
┊・ ${p}proses <id>            | ${p}setproses <label>
┊・ ${p}done <id>              | ${p}setdone <label>
╰┈┈┈┈┈┈┈┈

╭────〔 LAINNYA 〕─
┊・ ${p}menu
┊・ ${p}ping
┊・ ${p}sticker
╰┈┈┈┈┈┈┈┈

_Fitur otomatis:_ antilink=${config.antiLink ? 'ON' : 'OFF'}, welcome=${config.welcomeMessage ? 'ON' : 'OFF'}, farewell=${config.farewellMessage ? 'ON' : 'OFF'}
`.trim();

    await ctx.reply(text);
  },
};
