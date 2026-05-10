module.exports = {
  name: 'ping',
  description: 'Cek bot aktif',
  run: async (ctx) => {
    const start = Date.now();
    await ctx.reply('Pong! ' + (Date.now() - start) + ' ms');
  },
};
