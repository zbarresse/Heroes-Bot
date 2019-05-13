module.exports = async (client, message) => {

  debug = false

  /** ====================================================================== */
  /** SUPPORTING FUNCTIONS */

  function getGuildFile (guildIndex) {
    if (guildIndex === -1) { return '' }
    return files[guildIndex]
  }

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

  /** ====================================================================== */
  /** MAIN ROUTINE */

  let person = {}
  let personDiscord = null
  let force = false

  if (args.length === 0) {
    person = {discordIds: [callerId], language: 'ENG_US' }
    personDiscord = message.author
  } else if (args[0] === '-f' && args.length === 1) {
    person = {discordIds: [callerId], language: 'ENG_US' }
    personDiscord = message.author
    force = true
  } else if (args[0] === '-f' && args.length !== 1) {
    force = true
    if ((args[1].startsWith('<@') || args[1].startsWith('<@!')) && args[1].endsWith('>')) {
      person = {discordIds: [args[1].slice(2, -1)], language: 'ENG_US' }
      personDiscord = getMemberFromId(args[1].slice(2, -1))
    } else if ( args[1].replace(/-/g, '').length === 9 ) {
      person = {allycodes: [args[0].replace(/-/g, '')], language: 'ENG_US' }
    } else if ( args[1].length === 17 || args[1].length === 18) {
      person = {discordIds: [args[1]], language: 'ENG_US' }
      personDiscord = getMemberFromId(args[1])
    }
  } else if (args[0].length === 0) {
    person = {discordIds: [callerId], language: 'ENG_US' }
    personDiscord = getMemberFromId(callerId)
  } else if ((args[0].startsWith('<@') || args[0].startsWith('<@!')) && args[0].endsWith('>')) {
    if (args[0].startsWith('<@!')) {
      person = {discordIds: [args[0].slice(3, -1)], language: 'ENG_US' }
      personDiscord = getMemberFromId(args[0].slice(3, -1))
    } else if (args[0].startsWith('<@')) {
      person = {discordIds: [args[0].slice(2, -1)], language: 'ENG_US' }
      personDiscord = getMemberFromId(args[0].slice(2, -1))
    }
  } else if ( args[0].replace(/-/g, '').length === 9 ) {
    person = {allycodes: [args[0].replace(/-/g, '')], language: 'ENG_US' }
    // no discord, only ally code
    //personDiscord =
    person = {allycodes: [Number(args[0].replace(/-/g, ''))], language: 'ENG_US' }
  } else if ( args[0].length === 17 || args[0].length === 18) {
    person = {discordIds: [args[0]], language: 'ENG_US' }
    personDiscord = getMemberFromId(args[0])
  } else {
    return message.channel.send({
			embed: {
				color: 10232623,
				title: 'Unknown User',
				description: 'The user is not recognized. Please try using a discord @ mention or ally code.\n\n**Examples**:\n'+client.settings.prefix+command+' <@'+callerId+'>\n'+client.settings.prefix+command+' 279925735',
				timestamp: new Date(),
			}
		})
  }

  if(!force){force = args.indexOf('-f') > -1}

  let fresh = false
  let data = null
  let refreshed = 0
  let cooldown = 12
  let updated = ''
  let fs = require('fs')
  const file = './commands/members.json'
  const ApiSwgohHelp = require('api-swgoh-help')
  const credentials = require('./swapi.json')
  let login = credentials.swapi

  try {

    if (force) {
    	const swgoh = new ApiSwgohHelp(login)
      let swdata = await swgoh.fetchPlayer(person)
    	let { result, error, warning } = swdata
      if (error !== null || warning !== null) {
        return message.channel.send({
    			embed: {
    				color: 10232623,
    				title: 'Data Refresh Error',
    				description: 'I\'m sorry, I was unable to refresh the data from the swgoh api.',
    				timestamp: new Date(),
    			}
    		})
      }
      await fs.writeFileSync('./commands/'+guildFile, JSON.stringify(swdata, null, 2))
      data = result[0]
      fresh = true
      updated = new Date(result[0].updated)
    }

    let guild = await require('./'+guildFile)
    if(debug){console.log('0')}
    refreshed = (new Date() - new Date(guild.updated)) / 36e5
    if(debug){console.log('1')}
    updated = new Date(guild.result[0].updated)
    if(debug){console.log(refreshed, cooldown)}
    if(debug){console.log('2')}

    if (!guild || Math.floor(refreshed >= cooldown)) {
      return message.channel.send({
        embed: {
  				color: 10232623,
  				title: 'Data Fetch Error',
  				description: 'There was a problem fetching data.\n`Caller: `<@'+callerId+'>\n`File: `'+guildFile,
  				timestamp: new Date(),
        }
      })
    }

    if(debug){console.log(guild.result[0])}
    data = guild.result[0]
    fresh = false

  } catch(e) {

  	const swgoh = new ApiSwgohHelp(login)
    let swdata = await swgoh.fetchGuild(person)
  	let { result, error, warning } = swdata
    if (error !== null || warning !== null) {
      return message.channel.send({
  			embed: {
  				color: 10232623,
  				title: 'Data Refresh Error',
  				description: 'I\'m sorry, I was unable to refresh the data from the swgoh api.',
  				timestamp: new Date(),
  			}
  		})
    }

    await fs.writeFileSync('./commands/'+guildFile, JSON.stringify(swdata, null, 2))
    data = result[0]
    fresh = true
    updated = new Date(result[0].updated)

  }


}
