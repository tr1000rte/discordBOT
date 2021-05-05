module.exports = (client, triggerText, replyText) => {
    client.on('message', message => {
        if(message.content === "start") {
            let channel = message.channel;
            let members = channel.members;

            //Random function
            let splitRegex = /,|，|\/|\s+/;

            function getOneRandom(text) {
            let targets = text.split(splitRegex);
            let index = Math.round(Math.random() * (targets.length - 1));

            return targets[index];
            }
        }
    })
}