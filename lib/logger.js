// Logger sederhana berwarna
const color = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const ts = () => new Date().toLocaleTimeString('id-ID', { hour12: false });

module.exports = {
  info: (...a) => console.log(`${color.gray}[${ts()}]${color.reset} ${color.cyan}INFO${color.reset}`, ...a),
  ok:   (...a) => console.log(`${color.gray}[${ts()}]${color.reset} ${color.green}OK  ${color.reset}`, ...a),
  warn: (...a) => console.log(`${color.gray}[${ts()}]${color.reset} ${color.yellow}WARN${color.reset}`, ...a),
  err:  (...a) => console.log(`${color.gray}[${ts()}]${color.reset} ${color.red}ERR ${color.reset}`, ...a),
};
