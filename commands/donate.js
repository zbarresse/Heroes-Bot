module.exports = async (client, message) => {

  return message.channel.send({
		embed: {
			color: 10232623,
			title: 'Donations',
			description: 'This command is currently under construction.',
      thumbnail: {
        url: 'http://storyhive-uploads.dimerocker.com/telusproduction/54573732559cd.jpg'
      },
      footer: {
        icon_url: '',
        text: 'Tinkered on by KaosZman'
      },
			timestamp: new Date(),
		}
	})

};
