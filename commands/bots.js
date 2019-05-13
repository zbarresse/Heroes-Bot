module.exports = async (client, message) => {

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

  try {

		let embed = {};

		const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g)
		const command = args.shift().toLowerCase()
		embed.title = client.user.username+" : Bots";
    let header = ''
		let desc = ''
    let bots = []
    const links = require('./links.json')

		header = 'Show what badass bots we have in the server helping run skynet.\n';
		header += '`------------------------`\n';

		for (let bot in links.bots) {
      let botlinks = []
      //desc = '`Prefix` '+links.bots[bot].prefix+'\n'
      desc = 'Help: ``'+links.bots[bot].help+'``\n'
      desc += 'Description: '+links.bots[bot].description+'\n'
      if (links.bots[bot].discord !== '' || links.bots[bot].invite !== '' || links.bots[bot].url !== '' || links.bots[bot].master !== '') {
        if (links.bots[bot].discord !== '') { botlinks.push('[discord]('+links.bots[bot].discord+')') }
        if (links.bots[bot].invite !== '') { botlinks.push('[invite]('+links.bots[bot].invite+')') }
        if (links.bots[bot].url !== '') { botlinks.push('[link]('+links.bots[bot].url+')') }
        if (links.bots[bot].master !== '') { botlinks.push('My Master : '+links.bots[bot].master) }
        desc += botlinks.join(', ')+'\n'
      }
      desc += '`------------------------`\n';
      bots.push({
        "name": bot,
        "value": desc
      })
		}

		embed.color = 0x2A6EBB;
		embed.timestamp = new Date();
    embed.description = header
    embed.fields = bots
		message.react('ℹ');
		message.channel.send({embed});

	} catch(e) {
		throw e;
	}

}
