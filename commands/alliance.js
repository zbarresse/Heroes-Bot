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

  const files = ['h1.json', 'h2.json', 'h3.json', 'h4.json', 'h5.json', 'h6.json']
  const hally = [279925735, 533158926, 943285379, 356143758, 122763321, 138313943]
  debug = false
  let formatter = new Intl.NumberFormat(undefined, {
    style: 'decimal'
  })

  /** ====================================================================== */
  /** MAIN ROUTINE */

  let fresh = false
  let error = false
  let data = null
  let refreshed = 0
  let cooldown = 12
  let updated = null
  let guild = null
  let login = null
  let swdata = null
  let fs = require('fs')
  let gResult = []
  let gErrors = []
  let desc = ''

	const ApiSwgohHelp = require('api-swgoh-help')
	const credentials = require('./swapi.json')
	login = credentials.swapi

  for (let i = 0; i < files.length; i++) {

    try {

      error = false
      guild = await require('./'+files[i])
      if(debug){console.log('0')}
      refreshed = (new Date() - new Date(guild.result[0].updated)) / 36e5
      if(debug){console.log('1')}
      updated = guild.result[0].updated
      if(debug){console.log(refreshed, cooldown)}
      if(debug){console.log('2')}
      if (!guild || Math.floor(refreshed >= cooldown)) {
        throw new Error('error : '+files[i]+' : '+i+' of '+files.length)
      }
      if(debug){console.log(guild.result[0])}
      data = guild.result[0]
      fresh = false

    } catch(e) {

      const swgoh = new ApiSwgohHelp(login)
      swdata = await swgoh.fetchGuild({allycodes:hally[i], language:'ENG_US'})
    	let { result, error, warning } = swdata
      if (error !== null || warning !== null) {
        error = true
        gErrors.push({ 'name': 'Error', 'value': ')'+error.code+') '+error.description })
      } else {
        await fs.writeFileSync('./commands/'+files[i], JSON.stringify(swdata, null, 2))
        data = result[0]
        fresh = true
        updated = result[0].updated
      }
    }

    let gGP = 0
    let gRaid = data.raid
    let shipGP = 0
    let charGP = 0

    try {
      shipGP = data.roster.reduce((acc, x) => acc + x.gpShip, 0)
      charGP = data.roster.reduce((acc, x) => acc + x.gpChar, 0)
    } catch(e) {
      console.log('no char/ship stats: '+files[i])
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date(updated)
    let datestring = date.getDay()+'-'+months[date.getMonth()].substr(0, 3)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes().toString().padStart(2, '0')+':'+date.getSeconds()

    if(debug){console.log(updated)}
    //desc = '`------------------------`\n'
    desc = '`Guild` : __**'+data.name+'**__, data freshness: '+datestring+'\n'
    desc += '`Members` : '+data.members+'/50\n'
    desc += '`Overall GP` : '+formatter.format(data.gp)+'\n'
    desc += '`Total Character GP` : '+formatter.format(charGP)+'\n'
    desc += '`Total Ship GP` : '+formatter.format(shipGP)+'\n'
    desc += '`------------------------`\n'

    if (error) {
      gResult.push({ name: 'Error', value: '('+error.code+') '+error.description })
    } else {
      gResult.push({ name: 'Guild '+(i+1), value: desc })
    }

  }

  return message.channel.send({
    embed: {
      color: 2073021,
      title: 'Guild Found',
      description: '<@'+callerId+'>, I found the following data:',
      fields: gResult,
      timestamp: new Date(),
    }
  })

};
