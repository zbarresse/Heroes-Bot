module.exports = async (client, message) => {

  const files = ['h1.json', 'h2.json', 'h3.json', 'h4.json', 'h5.json', 'h6.json']
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

  function getFileFromAllyCode(allycode) {
    let file, data, found = null
    file = require('./'+files[0])
    data = file.result[0].roster
    found = data.find(g1 => g1.allyCode === allycode)
    if (found) { return files[0] }
    file = require('./'+files[1])
    data = file.result[0].roster
    found = data.find(g2 => g2.allyCode === allycode)
    if (found) { return files[1] }
    file = require('./'+files[2])
    data = file.result[0].roster
    found = data.find(g3 => g3.allyCode === allycode)
    if (found) { return files[2] }
    file = require('./'+files[3])
    data = file.result[0].roster
    found = data.find(g4 => g4.allyCode === allycode)
    if (found) { return files[3] }
    file = require('./'+files[4])
    data = file.result[0].roster
    found = data.find(g5 => g5.allyCode === allycode)
    if (found) { return files[4] }
    file = require('./'+files[5])
    data = file.result[0].roster
    found = data.find(g6 => g6.allyCode === allycode)
    if (found) { return files[5] }
    return 'not found'
  }

  function getMemberFromId(memberId) {
    return message.guild.member(memberId)
  }

  /** ====================================================================== */
  /** MAIN ROUTINE */

  const callerId = message.author.id
  const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  let validUser = getGuildFromMember(callerId)
  if (validUser === -1) {
    return message.channel.send({
			embed: {
				color: 9508429,
				title: 'Ruh Roh!',
				description: 'It looks like you\'re not a member of this alliance. Sorry \'bout your luck kid. Maybe ask a real member if they can help. :wink:',
				timestamp: new Date(),
			}
		})
  }

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

  let guildFile = ''
  if (personDiscord) {
    guildFile = files[getGuildFromMember(personDiscord.id)]
  } else {
    guildFile = getFileFromAllyCode(Number(person.allycodes))
  }

  if (!guildFile || guildFile === 'not found') {
    return message.channel.send({
      embed: {
				color: 10232623,
				title: 'Unknown Guild',
				description: 'The users guild was not found. Make sure you are using a discord @ mention, ally code, or discord id.\n\n**Examples**:\n'+client.settings.prefix+command+' <@'+callerId+'>\n'+client.settings.prefix+command+' 279925735',
				//description: allyload,
				timestamp: new Date(),
      }
    })
  }

  let fresh = false
  let data = null
  let refreshed = 0
  let cooldown = 12
  let updated = ''
  let fs = require('fs')

  try {

    if (force) {
    	const ApiSwgohHelp = require('api-swgoh-help')
    	const credentials = require('./swapi.json')
    	let login = credentials.swapi
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

  	const ApiSwgohHelp = require('api-swgoh-help')
  	const credentials = require('./swapi.json')
  	let login = credentials.swapi
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

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let date = new Date(updated)
  let datestring = date.getDay()+'-'+months[date.getMonth()].substr(0, 3)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes().toString().padStart(2, '0')+':'+date.getSeconds()

  let formatter = new Intl.NumberFormat(undefined, {
    style: 'decimal'
  })
  let gGP = 0
  let gRaid = data.raid
  let shipGP = 0
  let charGP = 0

  try {
    shipGP = data.roster.reduce((acc, x) => acc + x.gpShip, 0)
    charGP = data.roster.reduce((acc, x) => acc + x.gpChar, 0)
  } catch(e) {
    if(debug){console.log('no char/ship stats')}
  }

  if(debug){console.log(updated)}
  let desc = '<@'+callerId+'>, I found '+(fresh || force ? 'fresh data' : 'data in cache' )+'. Updated '+datestring+'\n'
  desc += '`------------------------`\n'
  desc += '`Guild` : '+data.name+'\n'
  desc += '`Members` : '+data.members+'/50\n'
  desc += '`Overall GP` : '+formatter.format(data.gp)+'\n'
  desc += '`Total Character GP` : '+formatter.format(charGP)+'\n'
  desc += '`Total Ship GP` : '+formatter.format(shipGP)+'\n'
  desc += '`------------------------`\n'
  return message.channel.send({
    embed: {
      color: 2073021,
      title: 'Guild Found',
      description: desc,
      timestamp: new Date(),
    }
  })



};
