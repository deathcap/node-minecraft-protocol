var mc = require('../');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.setPrompt(">");

var client = mc.createClient({
  username: process.argv[2],
  host: process.argv[4].split(":")[0],
  port: process.argv[4].split(":")[1],
  verbose: true
});

client.on('connect', function() {
  console.info("connected");
  rl.prompt();
  rl.on('line', function (line) {
    client.write(0x03, {message: line});
  });
});
client.on(0x03, function(packet) {
  console.log(parseColors(packet.message));
});
client.on('error', function(error) {
  console.log(error);
  rl.close();
});
client.on('end', function(data) {
  console.log(data);
  rl.close();
});

function parseColors(message) {
  message = message.replace(/§0/gi, "\x1b[30m\x1b[21m") // black
                   .replace(/§1/gi, "\x1b[34m\x1b[21m") // dark blue
                   .replace(/§2/gi, "\x1b[32m\x1b[21m") // dark green
                   .replace(/§3/gi, "\x1b[36m\x1b[21m") // dark cyan
                   .replace(/§4/gi, "\x1b[31m\x1b[21m") // dark red
                   .replace(/§5/gi, "\x1b[35m\x1b[21m") // purple
                   .replace(/§6/gi, "\x1b[33m\x1b[21m") // gold
                   .replace(/§7/gi, "\x1b[37m\x1b[21m") // gray
                   .replace(/§8/gi, "\x1b[30m\x1b[1m")  //dark gray
                   .replace(/§9/gi, "\x1b[34m\x1b[1m")  // blue
                   .replace(/§a/gi, "\x1b[32m\x1b[1m")  // bright green
                   .replace(/§b/gi, "\x1b[36m\x1b[1m")  // cyan
                   .replace(/§c/gi, "\x1b[31m\x1b[1m")  // red
                   .replace(/§d/gi, "\x1b[35m\x1b[1m")  // pink
                   .replace(/§e/gi, "\x1b[33m\x1b[1m")  // yellow
                   .replace(/§f/gi, "\x1b[38m\x1b[1m")  // white
                   .replace(/§k/gi, "\x1b[5m") // random
                   .replace(/§l/gi, "\x1b[1m") // bold
                   .replace(/§m/gi, "\x1b[9m") // strikethrough (not widely supported)
                   .replace(/§n/gi, "\x1b[4m") // underline
                   .replace(/§o/gi, "\x1b[3m") // italic (not widely supported)
                   .replace(/§r/gi, "\x1b[0m"); // reset
  message += "\x1b[0m";
  return message;
}
