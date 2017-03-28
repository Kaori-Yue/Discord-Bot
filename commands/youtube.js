const ytdl = require('ytdl-core')
const fs = require('fs')
// const ytdl = require('youtube-dl')


let _msg
let client
let assets = './files/youtube'
let play_stream
let playlist = []
let dispatcher

exports.init = (bot) => {
	client = bot
	fs.existsSync(assets) || fs.mkdirSync(assets)
}



exports.run = function(msg, args) {

	_msg = msg

	// if(!(args instanceof Array)){
	// 	if(_stickers.hasOwnProperty(args)) return this.sendSticker(args)
	// 	// return _msg.delete()
	// 	client.send(_msg, `${_msg.author} sticker not found`);
	// }

	let newargs  = []
	for(let i = 1; i < args.length; i++)
		newargs.push(args[i])

	// Subcommand?
	if(args[0] === 'play') return this.play(newargs)
	if(args[0] === 'queue') return this.queue(newargs)
	if(args[0] === 'vol') return this.volume(newargs)
	// if(args[0] === 'del') return this.del(newargs)
	// if(args[0] === 'ren') return this.ren(newargs)
	// if(args[0] === 'list') return this.list()
	// if(args[0] === 'migrate') return this.migrate()

	// Not a subcommand, let's see if it's a sticker
	// if(_stickers.hasOwnProperty(args[0])) return this.sendSticker(args[0])
	
	// Ded
	// _msg.delete()
	
}

exports.play = (args, username = _msg.author.username) => {
	let filename

	if (play_stream) {
		addPlaylist(args[0], _msg)
		return
	}

	_msg.member.voiceChannel.join()
	.then(connection => {
		ytdl.getInfo(args[0], {filter: 'audioonly'}).then(info => {
			// filename = `${info.title} [${info.video_id}].opus`
			filename = `${info.video_id}.opus`
			//
			const stream = ytdl(args[0], {filter : 'audioonly'}).pipe(fs.createWriteStream(`${assets}/${filename}`, 'utf8'))
			//
			stream.on('finish', () => {
				console.log('[ytdl]: Download completed..')
				play_stream = true
				dispatcher = connection.playFile(`${assets}/${filename}`)
				// client.user.setGame(`${info.title}`)
				client.user.setGame(info.title)
				dispatcher.on('end', () => {
					client.user.setGame()
					play_stream = false
					// ไม่ทำไฟล์เพราะว่า let filename เปลี่ยนชื่อไปตอนเริ่ func ใหม่ ต้องเขียนอีดว้นมาดักด้านบนให้ถ้าเล่นเพลงอยู่ให่บลาๆไป
					fs.unlink(`${assets}/${filename}`, (err) => {
						if (err) {
							console.log('unlink failed: ', err)
						} else {
							console.log('unlink completed')
						}
					})
					//
					if (playlist[0] !== null) {
						this.play([playlist[0].uri], playlist[0].name)
						playlist.splice(0,1) // remove first playlist
					}
				})
			})
		})			
	})
}
// ===============================================================
exports.queue = () => {
	let list = '';
	// console.log
	for (let index in playlist) {
		// console.log(_playlist)
		list += convertIndex(index) + ` - ${playlist[index].uri} | Request by: ${playlist[index].name}\n`
	}
	return client.send(_msg, list)
		
}
// ===============================================================
exports.volume = (args) => {
	dispatcher.setVolume(args[0])
}
// ===============================================================

function addPlaylist (args, message) {
	// console.log(args)
	let obj = {name: message.author.username, uri: args}
	playlist.push(obj)
	client.send(message, 'Added to playlist..')
	// console.log(message)
	// console.log(playlist[0])
	// if (playlist[0] !== null) console.log(playlist[0].uri)
	// console.log(message.member.guild.name)
}
// ===============================================================
function getPlaylist () {

}

function convertIndex(index) {
	index++
	return index > 9 ? "" + index: "0" + index
}