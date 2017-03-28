const config = require('./config.js');
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const knex = require('knex')(config.database);
// const ytdl = require('ytdl-core');

// ===============================================================
bot.on('message', (message) => {
	// message.member.voiceChannel.join().then(connection => {
 //  		require('https').get('https://listen.moe/stream', (res) => {
 //    		connection.playStream(res);
 //  		})
	// })
	// const streamOptions = { seek: 0, volume: 1}
	// message.member.voiceChannel.join()
	// 	.then(connection => {
	// 		const stream = ytdl('https://www.youtube.com/watch?v=g8OgI3lYd9s', {filter : 'audioonly'});
	// 		const dispatcher = connection.playStream(stream, streamOptions);
	// 		console.log('playing..')
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	});
	// if (message.author.id !== config.ownerid) return;
	// console.log(config.ownerid.includes(message.author.id));
	if (!config.ownerid.includes(message.author.id)) return;
	// Ignore if the message doesn't start with our prefix
	if (!message.content.startsWith(config.prefix)) return;

	// Ignore if empty command
	if (message.content.length === config.prefix.length) return;

	// message.reply(JSON.stringify(message));
	// message.channel.send(JSON.stringify(message));
	// message.channel.sendMessage()
	// bot.send(message, message.author.username);
	//////////////////////////////////////
	    // Get all the arguments
	let tmp = message.content.substring(config.prefix.length, message.length).split(' ')
	let args = []

	for(let i = 1; i < tmp.length; i++)
		args.push(tmp[i])

	// Store the command separately
	let cmd = tmp[0]

	if(bot.modules.hasOwnProperty(cmd)) return bot.modules[cmd].run(message, args);
	if(config.commandError.sendToModule === true) return bot.modules[config.commandError.module][config.commandError.function](message, cmd);
	// return message.delete()

});
// ===============================================================
bot.on('guildMemberAdd', member => {
	// Sv Parallel World
	if (member.guild.id === '239850072572035073') {
		member.guild.defaultChannel.sendMessage(`Welcome ${member} to ${member.guild.name}\npls turn off notifications #bot`)
		return
	}

	//
	member.guild.defaultChannel.sendMessage(`Welcome ${member}`)

	// member.guild.defaultChannel.sendMessage(`${member} a rejoint le serveur ${member.guild.name}`);
});
// ===============================================================
bot.send = (message, content) => {
	// let msg = JSON.stringify(message);
	// let con = JSON.stringify(content);
	// message.channel.sendMessage(`Message: ${msg}\n\nContent: ${con}`);
	// message.channel.send(`Message: ${msg}\n\nContent: ${con}`);
	message.channel.sendMessage('```' + content + '```');
	// console.log(msg);
	/*
	message.channel.sendMessage({
        "embed": {
                title: 'Buienradar',
                url: 'http://www.buienradar.nl/',
                "image": {
                "url": "http://api.buienradar.nl/image/1.0/RadarMapNL?a=.gif",
                }
            }
        });
    */
    ////////////////////////////////////
}
// ===============================================================
bot.loadModules = () => {
	bot.modules = {};

	fs.readdirSync('./commands/').forEach(function(file) {
		let name = file.slice(0, -3);
		delete require.cache[require.resolve('./commands/' + file)]
		try {
			bot.modules[name] = require('./commands/' + file);
			if (bot.modules[name].hasOwnProperty('init'))
				bot.modules[name].init(bot);
			console.log(`Module ${name} is ready`);
		} catch(e) {
			console.log(`Error in module ${name}:\n${e.stack}`);
		}
	});
}
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
bot.once('ready', () => {
	fs.exists('db', (exists) => exists || fs.writeFile('db', ''));
	bot.db = knex;
	bot.config = config;
	bot.loadModules();
	console.log('[Bot]: Ready!..');
	bot.user.setGame()
});
// ===============================================================
/*
bot.on('ready', () => {
	// bot.loadModules();
	console.log('[Bot]: Ready!..');
});
*/
// ===============================================================
bot.login(config.token);