var readline = require('readline');
var color = require("ansi-color").set;
var mc = require('../');
var states = mc.protocol.states;
var c = new Buffer("§", "utf-8");

var colorCodes = new Array();
colorCodes[c.toString('utf-8') + '0'] = 'black+white_bg';
colorCodes[c.toString('utf-8') + '1'] = 'white+blue_bg';
colorCodes[c.toString('utf-8') + '2'] = 'green';
colorCodes[c.toString('utf-8') + '3'] = 'blue';
colorCodes[c.toString('utf-8') + '4'] = 'red';
colorCodes[c.toString('utf-8') + '5'] = 'magenta';
colorCodes[c.toString('utf-8') + '6'] = 'yellow';
colorCodes[c.toString('utf-8') + '7'] = 'white';
colorCodes[c.toString('utf-8') + '8'] = 'white';
colorCodes[c.toString('utf-8') + '9'] = 'blue';
colorCodes[c.toString('utf-8') + 'a'] = 'green';
colorCodes[c.toString('utf-8') + 'b'] = 'cyan';
colorCodes[c.toString('utf-8') + 'c'] = 'red';
colorCodes[c.toString('utf-8') + 'd'] = 'magenta';
colorCodes[c.toString('utf-8') + 'e'] = 'yellow';
colorCodes[c.toString('utf-8') + 'f'] = 'white';
colorCodes[c.toString('utf-8') + 'k'] = 'blink';
colorCodes[c.toString('utf-8') + 'l'] = 'bold';
colorCodes[c.toString('utf-8') + 'n'] = 'underline';
colorCodes[c.toString('utf-8') + 'r'] = 'white';

var colors = new Array();

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
 
function print_help() {
    console.log("usage: node minechat.js <hostname> <user> <password>");
}
 
if (process.argv.length < 5) {
    console.log("Too few arguments!");
    print_help();
    process.exit(1);
}
 
process.argv.forEach(function(val, index, array) {
    if (val == "-h") {
        print_help();
        process.exit(0);
    }
});
 
var host = process.argv[2];
var port = 25565;
var user = process.argv[3];
var passwd = process.argv[4];
 
if (host.indexOf(':') != -1) {
    port = host.substring(host.indexOf(':')+1);
    host = host.substring(0, host.indexOf(':'));
}
 
console.log("connecting to " + host + ":" + port);
console.log("user: " + user);
console.log("passwd: " + Array(passwd.length).join('*'));
 
var client = mc.createClient({
    host: host,
    port: port,
    username: user,
    password: passwd
});
 
client.on(0xff, function(packet) {
    console.info(color('Kicked for ' + packet.reason, "blink+red"));
    process.exit(1);
});
 
client.on('connect', function() {
    console.info(color('Successfully connected to ' + host + ':' + port, "blink+green"));
});
 
rl.on('line', function(line) {
    if(line == '') {
        return; 
    } else if(line == '/quit') {
        var reason = 'disconnect.quitting';
        console.info('Disconnected from ' + host + ':' + port);
        client.write(0xff, { reason: reason });	
        return;
    } else if(line == '/end') {
        console.info('Forcibly ended client');
        process.exit(0);
        return;
    }
    if (client.state == states.PLAY) {
        client.write(0x01, {message: line});
    }
});
 
client.on([states.PLAY, 0x02], function(packet) {
    var j = JSON.parse(packet.message);
    var chat = "";
    var colorWith = "";
    if (j.color !== null) colorWith = colors[j.color];
    if (j.text !== null) chat += j.text;
    else if (j.translate !== null) chat += j.translate;
    for (var s in j.extra) {
        if (typeof s === "string") {
            chat += s;
        } else {
            s.
        }
    }
    
    console.log(j);
    for (var s in j.extra) {
        if (typeof s === "string") {
            chat += s;
        } else {
            chat += color(s.text, s.color);
        }
    }
    console.info(chat);
});

function parseChat(chatObj) {
    
}