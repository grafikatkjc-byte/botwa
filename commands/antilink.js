const config = require('../config');

module.exports = {
  name: 'antilink',
  description: 'Toggle fitur anti-link. Pakai: .antilink on | off',
  run: async (ctx) => {
    if (!ctx.isGroup) return ctx.reply('Perintah hanya untuk grup.');
    if (!ctx.isAdmin && !ctx.isOwner) return ctx.reply('Khusus admin grup.');

    const v = (ctx.args[0] || '').toLowerCase();
    if (v === 'on') config.antiLink = true;
    else if (v === 'off') config.antiLink = false;
    else return ctx.reply('Status anti-link sekarang: ' + (config.antiLink ? 'ON' : 'OFF') + '\nPakai: .antilink on|off');

    await ctx.reply('Anti-link: ' + (config.antiLink ? 'ON' : 'OFF'));
  },
};
