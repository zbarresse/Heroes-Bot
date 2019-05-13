module.exports = async( client, message ) => {


  	try {

  		let embed = {}
      let fields = []
      let desc = ''

  		const links = require('./links.json')

      desc = ''
  		for (let bot in links.bots) {
        if (links.bots[bot].discord !== '') { desc += '['+bot+']('+links.bots[bot].discord+')\n' }
  		}
      if (desc !== '') { fields.push({name:'Bot Discords', value: desc, inline: true}) }

      desc = ''
      for (let faction in links.factions) {
        if (links.factions[faction].discord !== '') { desc += '['+faction+']('+links.factions[faction].discord+')\n' }
      }
      if (desc !== '') { fields.push({name:'Faction Discords', value: desc, inline: true}) }

      desc = ''
      for (let site in links.websites) {
        if (links.websites[site].discord !== '') { desc += '['+site+']('+links.websites[site].discord+')\n' }
      }
      if (desc !== '') { fields.push({name:'Websites', value: desc, inline: true }) }

      desc = ''
      for (let resc in links.resources) {
        if (links.resources[resc].discord !== '') { desc += '['+resc+']('+links.resources[resc].discord+')\n' }
      }
      if (desc !== '') { fields.push({name:'Resource Discords', value: desc, inline: true}) }

      embed.title = "SWGoH Information"
      embed.description = 'A collection of helpful links\n`------------------------`'
  		embed.color = 0x2A6EBB
  		embed.timestamp = new Date()
      embed.fields = fields

  		message.react('ℹ')
  		message.channel.send({embed})


    } catch(e) {
      throw(e)
    }

}
