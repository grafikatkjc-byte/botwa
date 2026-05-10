// Registry command. Setiap command adalah { run(ctx) }.
const fs = require('fs');
const path = require('path');

const commands = {};

for (const file of fs.readdirSync(__dirname)) {
  if (file === 'index.js' || !file.endsWith('.js')) continue;
  const mod = require(path.join(__dirname, file));
  const name = mod.name || file.replace('.js', '');
  commands[name.toLowerCase()] = mod;
  if (Array.isArray(mod.aliases)) {
    for (const a of mod.aliases) commands[a.toLowerCase()] = mod;
  }
}

module.exports = commands;
