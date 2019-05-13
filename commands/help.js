module.exports = async ( client, message ) => {

  function getGuildFromMember(memberId) {
    let caller = getMemberFromId(memberId)
    if (caller.roles.find(r => r.name === 'G1Heroes')) {
      return 0
    } else if (caller.roles.find(r => r.name === 'G2Heroes')) {
      return 1
    } else if (caller.roles.find(r => r.name === 'G3Heroes')) {
      return 2
    } else if (caller.roles.find(r => r.name === 'G4Heroes')) {
      return 3
    } else if (caller.roles.find(r => r.name === 'G5Heroes')) {
      return 4
    } else if (caller.roles.find(r => r.name === 'G6Heroes')) {
      return 5
    } else {
      return -1
    }
  }

  function getMemberFromId(memberId) {
    return message.guild.member(memberId)
  }

	//console.log(new Map(client.users))
	//console.log(client.user.id)

	try {

		let embed = {};
		const callerId = message.author.id
		const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g)
		const command = args.shift().toLowerCase()
		embed.title = client.user.username+" : Help";
		let desc = ''

		const links = require('./links.json')
		let validUser = getGuildFromMember(callerId)

		if (validUser === -1 && callerId === '218216309144551425') { //lazyturtle
			desc = 'Hey <@218216309144551425>, wassup buddy. We miss you. Come back.\n'
		} else if (validUser === -1 && callerId === '360067851811291157') { //lazyturtle
			desc = '<@360067851811291157>, we love you. And your beard. You sexy bitch. Come back.\n'
		} else if (validUser === -1 && callerId === '393797714363547660') { //Heisenberg
			desc = 'It\'s a bird! It\'s a plane! No, it\'s a wild <@393797714363547660>! Praise the sun!\n'
		} else if (validUser === -1) {
			desc = 'Hello esteemed guest! While you may not be a member of the dopest and most badass alliance evah, you\'re still cool peeps.\n'
		} else {
			desc = 'Hello <@'+callerId+'> from Guild '+(validUser+1)+'!\nThis is our super dope alliance bot.\n';
			//desc += '<@'+callerId+'> you are special too.\n'
		}

		desc += '`------------------------`\n';
		desc += '**Prefix**: ``'+client.settings.prefix+'``\n';
		if (callerId !== '170712392894775298') { desc += 'Ping the geek: <@170712392894775298>\n' }

		desc += '`------------------------`\n';
		desc += '**Commands**\n';
		desc += '`'+client.settings.prefix+'help`: show help, like, this...\n'
		desc += '`'+client.settings.prefix+'guild` : Show guild stats, pass player\n';
		desc += '`'+client.settings.prefix+'alliance` : Show alliance stats\n';
		desc += '`'+client.settings.prefix+'bots` : Show alliance bot info\n';
		desc += '`'+client.settings.prefix+'swgoh` : Show swgoh links\n';
		//desc += '`'+client.settings.prefix+'donate` : show guild donations (under construction)\n';
		desc += '`------------------------`\n';

		desc += '**Guild links**\n';
		for (let guild in links.guilds) {
			desc += '['+links.guilds[guild].name+']('+links.guilds[guild].url+')\n'
		}
		desc += 'Share our discord server: [here](https://discord.gg/S365kDU)\n';
		desc += '`------------------------`\n';
		desc += '\n';

		if (args.length === 0) {

		} else if (args[0].toLowerCase() === 'guild') {
			/** GUILD HELP */
			desc = '`'+client.settings.prefix+'guild` help\n'
			desc += '`------------------------`\n';
			desc += '`Purpose` : Show basic guild stats\n'
			desc += '`Examples` : \n```'+client.settings.prefix+'guild\n'+client.settings.prefix+'guild @KaosZman#6288\n'+client.settings.prefix+'guild 279925735 (allycode)\n'+client.settings.prefix+'guild 170712392894775298 (discord id)```'

		} else if (args[0].toLowerCase() === 'alliance') {
			/** ALLIANCE HELP */
			desc = '`'+client.settings.prefix+'alliance` help\n'
			desc += '`------------------------`\n';
			desc += '`Purpose` : Show all alliance guild stats\n'
			desc += '`Examples` : \n```'+client.settings.prefix+'alliance```'

		} else if (args[0].toLowerCase() === 'donate') {
			/** DONATE HELP */
			desc = '`'+client.settings.prefix+'donate` help\n'
			desc += '`------------------------`\n';
			desc += '`Purpose` : Show all guild member donations\n'
			desc += '`Examples` : \n```'+client.settings.prefix+'donate```'

		} else if (args[0].toLowerCase() === 'bots') {
			/** BOTS HELP */
			desc = '`'+client.settings.prefix+'bots` help\n'
			desc += '`------------------------`\n';
			desc += '`Purpose` : Show all bot prefixes & help commands\n'
			desc += '`Examples` : \n```'+client.settings.prefix+'bots```'

		} else if (args[0].toLowerCase() === 'swgoh') {
			/** SWGOH HELP */
			desc = '`'+client.settings.prefix+'swgoh` help\n'
			desc += '`------------------------`\n';
			desc += '`Purpose` : Show links for useful swgoh stuff\n'
			desc += '`Examples` : \n```'+client.settings.prefix+'swgoh```'

		}

		embed.description = desc
		embed.color = 0x2A6EBB;
		embed.timestamp = new Date();
		message.react('ℹ');
		message.channel.send({embed});

	} catch(e) {
		throw e;
	}

}
