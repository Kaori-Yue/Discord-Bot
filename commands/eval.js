let client
exports.init = function(bot){ client = bot }

exports.run = function(msg, args) {

        var code = args.join(' ')

        try {
                var evaled = eval(code)
                if (typeof evaled !== 'string')
                        evaled = require('util').inspect(evaled)
                msg.channel.sendCode('xl', clean(evaled))
        }catch(err) {
                msg.channel.sendMessage('`ERROR` ```xl\n' + clean(err) + '\n```')
                console.log(clean(err))
        }

}

function clean(text) {
        if (typeof(text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        }
        else {
                return text
        }
}