const config = require('./config.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const knex = require('knex')(config.database);

// ===============================================================

client.once('ready', () => {
	fs.exists('db', (exists) => exists || fs.writeFile('db', ''));
	client.db = knex
	client.config = config;
	client.loadCommanads();
	console.log('[Bot] ready!');
});

// ===============================================================

client.loadCommanads = () => {
	client.modules = {};

	fs.readdirSync('./commands/').forEach(function(file) {
		let name = file.slice(0, -3);
		delete require.cache[require.resolve('./commands/' + file)]
		try {
			client.modules[name] = require('./commands/' + file);
			if (client.modules[name].hasOwnProperty('init')) {
				client.modules[name].init(client);
			}
				console.log(`Module ${name} is ready`);
		} catch(e) {
			console.log(`Error in module ${name}:\n${e.stack}`);
		}
	});
}

// ===============================================================

// client.on('guildMemberAdd', member => {
// 	member.guild.defaultChannel.sendMessage(`${member} a rejoint le serveur ${member.guild.name}`);
// });

client.on('message', (msg) => {
	// console.log(msg);
	client.send(msg, '1');
	// Ignore if the message doesn't start with our prefix
	if (!msg.content.startsWith(config.prefix)) return;

	// Ignore if empty command
	if (msg.content.length === config.prefix.length) return;

	// Get all the arguments
	let tmp = msg.content.substring(config.prefix.length, msg.length).split(' ')
	let args = []

	for(let i = 1; i < tmp.length; i++)
		args.push(tmp[i])

	// Store the command separately
	let cmd = tmp[0]

	if(client.modules.hasOwnProperty(cmd)) return client.modules[cmd].run(msg, args);
	if(config.commandError.sendToModule === true) return client.modules[config.commandError.module][config.commandError.function](msg, cmd);
	// return msg.delete()
});

// ===============================================================

client.reply = function(msg, content){
	msg.reply(content).then(msg => console.log(`Sent a reply to ` + JSON.stringify(msg))).catch(console.error);
}

client.send = (msg, content) => {
	msg.send(content).then(msg => console.log(`send: ${msg}`)).catch(console.error);
}

// ===============================================================
client.login(config.token);