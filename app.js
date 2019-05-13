//Build client
const Discord 	= require('discord.js');
const client 	= new Discord.Client();

/** SET CLIENT SETTINGS */
client.folders = {
	root:__dirname,
	config:__dirname+'/config/',
	utilities:__dirname+'/utilities/',
	commands:__dirname+'/commands/'
}


/**
 * STARTUP, INIT SETTINGS AND LOGIN
 */
client.startUp = async () => {
	try {
		await require(client.folders.utilities+'startUp.js')( client );
		await client.login(client.settings.token);
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }
}


/**
 * SHUTDOWN GRACEFULLY
 */
client.shutDown = async () => {
	try {
		await require(client.folders.utilities+'shutDown.js')( client );
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }
}


/**
 * MONITOR CLIENT
 */
//ON READY
client.on('ready', async () => {
	console.info(`Started successfully`);
});

//ON DISCONNECT
client.on('disconnect', async (event) => {
	console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
	//Try login again
	if( event.code !== 4004 ) {
		try {
			await client.login(client.settings.token);
		} catch(e) {
			console.error(' ! Error trying to re-login\n',e);
			await client.shutDown();
		}
	}
});

//ON RECONNECTING
client.on('reconnecting', async (e) => {
	console.warn('\n ! Client reconnecting -'+new Date());
	if(e) console.error(e.message);
});

//ON RESUME
client.on('resumed', async (replayed) => {
    console.info('\n ! Client resumed -'+new Date());
    if(replayed) console.log(replayed);
});

//ON ERROR
client.on('error', async (error) => {
    console.error('\n ! Client connection error -'+new Date());
    if(error) console.error(error.message);
});

//ON WARNING
client.on('warn', async (info) => {
	console.warn('\n ! Client warning -'+new Date());
	if(info) console.warn(info);
});



/**
 * MONITOR MESSAGES
 */
//ON MESSAGE RECEIVED
client.on('message', async (message) => {

	/** Ignore conditions **/
	if( message.author.bot ) { return; }
	if( !message.content.startsWith(client.settings.prefix) ) { return; }

	try {

		//Match command syntax
		//const cmdRegex = new RegExp("^("+client.settings.prefix+")(.[\\S]+)[\\s]*");
		//command = message.content.match(cmdRegex) ? message.content.match(cmdRegex)[2].trim() : null;
		const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g)
		const command = args.shift().toLowerCase()

		/** Ignore condition **/
		if( !command || !client.settings.commands[command] ) {
			return message.channel.send({
				embed: {
					color: 10232623,
					title: 'Unknown Command',
					description: 'I\'m sorry but I don\'t recognize that command. Check out my help commands with `'+client.settings.prefix+'help`',
					timestamp: new Date(),
				}
			});
		}

		//Do command
		await message.react('🤔');
		await require(client.folders.commands+client.settings.commands[command])( client, message );

	} catch(e) {
		console.error(e);
		client.helpers.replyWithError( message, e );
	}

});




/*********************************************/
/** SETUP FOR BORG EMOJI WATCHING **/
/*********************************************/

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
}

client.loggedMessages = require('./commands/loggedMessages.json')

client.on('raw', async event => {

	try {

		if (!events.hasOwnProperty(event.t)) return

		const { d: data } = event
		const user = client.users.get(data.user_id)
		const channel = client.channels.get(data.channel_id) || await user.createDM()

		if (channel.messages.has(data.message_id)) return

		const message = await channel.fetchMessage(data.message_id)
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.eventName
		let reaction = message.reactions.get(emojiKey)

		if (!reaction) {
				const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji)
				reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id)
		}

		client.emit(events[event.t], reaction, user)

	} catch(e) {
		console.error(e)
		client.helpers.replyWithError( event, e )
	}

})

client.on('messageReactionAdd', async (reaction, user) => {

	if (reaction.message.channel.id === '353321647194767361') {//test:434051100379840512, actual:353321647194767361

		if (reaction.emoji.name === 'borg') {

			if (!client.loggedMessages.id.find(id => id === reaction.message.id)) {

				client.channels.get('576098827929649162').send({ //test:434051100379840512, actual:576098827929649162
					embed: {
						color: 4816192,
						title: 'Availability Log',
						description: `**${user.username} marked a message from <@${reaction.message.author.id}> in <#${reaction.message.channel.id}> which was:**\n${reaction.message.content}.`,
						timestamp: new Date(),
					}
				})

				client.loggedMessages.id.push(reaction.message.id)
				const fs = require('fs')
	      await fs.writeFileSync('./commands/loggedMessages.json', JSON.stringify(client.loggedMessages, null, 2))

			}

		}

	}

})

client.on('messagereactionremove', (reaction, user) => {
	console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`)
})

/*********************************************/


	/*
client.on('guildMemberAdd', member => {
	client.channels.get('431841806825553920').send({
		embed: {
			color: 4816192,
			description: `**${member.username} just joined the server!`
		}
	})
})


client.on('guildMemberRemove', member => {
	let filteredRoles = member.roles.filter((role) => /^#[0-9a-zA-Z]{6}$/.test(role.name))
	console.log(filteredRoles)

	client.channels.get('431841806825553920').send({
		embed: {
			color: 4816192,
			description: `**<@${member.id}> just left the server. They had the following roles: `+filteredRoles.join(', ')
		}
	})

})
	*/

process.on('SIGTERM', client.shutDown);
process.on('SIGINT', client.shutDown);

//Do start up
client.startUp();
