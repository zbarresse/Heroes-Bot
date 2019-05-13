module.exports.run = async( client, message, logchannel ) => {


  let emoji = message.guild.emojis.find('name', "borg")

  const reactions = await message.awaitReactions(reaction => reaction.emoji.name === watch)
  console.log
  message.channel.send('Reaction noted\nCount: ${reactions.get(watch).count-1}\n')

}
