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
		desc = 'ding'
	} else {
		desc = 'pong';
	}

  return message.channel.send({
    embed: {
      color: 4816192,
      title: 'De de dee',
      description: desc,
      thumbnail: {
        "url": "https://media.wired.com/photos/59fccff22d3f5732c7d5aa15/master/w_2400,c_limit/Pong-TA-B1C1YX.jpg"
      },
      timestamp: new Date(),
    }
  })

}
