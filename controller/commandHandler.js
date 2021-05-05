module.exports = {
    name:'command',
    description: 'Embeds!',
    execute(message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('Rules')
        .setURL('http://youtube.com')
        .setDescription('Embed test')
        .addFields(
            {name: 'Rule 1', value: 'nice'},
            {name: 'Rule 2', value: 'a nice'},
            {name: 'Rule 3', value: 'so nice'}
        )
        .setImage('https://i.imgur.com/wmaQrwg.jpg')
        .setFooter('Make it as a lottery');

        message.channel.send(newEmbed);
    }
}