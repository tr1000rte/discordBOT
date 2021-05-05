const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./JSON/auth.json');
const reply = require('./JSON/reply.json')
const question = require('./JSON/question.json')
const rp = require('request-promise');
const axios = require('axios');

const privateMsg = require('./controller/privateMsg');
const { json } = require('body-parser');
// const command = require('./controller/commandHandler');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', message => {
  //判斷群組、機器人訊息
  try {
    if(!message.guild || !message.member) return;
    if(message.member.user.bot) return;
  } catch (err) {
    return;
  }
  //回復功能
  let inputStr = message.content;
  let trigger = inputStr.toString().toLowerCase();

  if (message.content === "速度") {
    message.channel.send(reply.image.car.速度);

  } else if (trigger === "peko") {
    message.channel.send(reply.image.single.peko);

  } else if (message.content === "等") {
    message.channel.send(reply.image.single.好耶)

  } else if (message.content === `!help`) {
    message.channel.send(`
    功能顯示:

    help - 顯示所有功能
    投票 - 投票功能
    `)
  }
})

var Channel = {
  "懶貓": "failverde",
  "木棉花官方": "muse_tw"
};


//Twitch開台功能
client.on("message", message => {
  if (message.content === "開台") {
      
      let myRequest = [];
      let peopleNumber = 0;

      
      for (channelName in Channel) {
          console.log("查看:" + channelName + "ID:" + Channel[channelName]);
          myRequest.push(rp(CheckOnlineStatus(Channel[channelName])));
          // console.log(myRequest)
      }
      Promise.all(myRequest)
            .then((arrayOfResult) => {
              // console.log(myRequest)
              // console.log(arrayOfResult);
                arrayOfResult.forEach(function (result) {
                    // console.log("arrayOfResult: ", result);
                    let newResult = "";
                    newResult = JSON.parse(result);
                    // console.log(newResult);
                    if (newResult.data.length != 0 && newResult.data[0].type == "live") {
                        // console.log("有開: " + newResult.data[0].user_name + " ID: " + Channel[newResult.data[0].user_name]);
                        message.channel.send(newResult.data[0].user_name + "目前有開 快去看 --> " + "https://www.twitch.tv/" + Channel[channelName]);
                        peopleNumber++;
                    }
                });

          if(peopleNumber == 0) {
              message.channel.send("沒人開台");
          }
      })
      .catch(err => {
          console.log(err);
      })
  }
});

function CheckOnlineStatus(user_login) {
  const options = {
      url: 'https://api.twitch.tv/helix/streams?user_login=' + user_login,
      headers: {
          'client-id': auth.twitch_ClientID,
          'Authorization': auth.twitch_Authorization
      }
  };
  return options;
}


//mute功能
client.on('message', (message) => {
  let channel = message.channel
  let members = channel.members

  if (message.content.startsWith("sh")) {
    members.forEach(member => {
      member.voice.setMute(true)
      // member.voice.setDeaf(true)
    });
    message.channel.send('muted')
  
  } else if (message.content.startsWith("talk")){
    members.forEach(member => {
      member.voice.setMute(false)
      member.voice.setDeaf(false)
    });
    message.channel.send('unmuted')
  }
  
})


//youtube推播功能
var youtubeChannel_ID = {
  "LEC": "FkAJvI1t5-o",
  "KoroneCh.戌神ころね": "cdtzQixacmQ",
  "MatsuriChannel夏色まつり": "W3mTgS3JPTY"
}
var singingList = ['貓哥','名鴻','名璿','阿彣','Vicky','Yee']
client.on("message", message => {
  if (message.content === "yt") {

    let myYoutubeRequest = [];
    peopleNumYt = 0;

      for(channelName in youtubeChannel_ID) {
        console.log("查看: " + channelName + "ID:" + youtubeChannel_ID[channelName]);
        axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${youtubeChannel_ID[channelName]}&key=AIzaSyCbwkz2g1OUJcitE8xbPn7TWX3LoyAXqGY&part=snippet`).then(response => {
        let arrayOfYoutubeResponse = response.data.items;
        myYoutubeRequest.push(arrayOfYoutubeResponse);
        // console.log(arrayOfYoutubeResponse);
        let myYoutubeObj = Object.assign({}, arrayOfYoutubeResponse);
        let checkOnlineStatus = myYoutubeObj[0].snippet.liveBroadcastContent;
        
        if (checkOnlineStatus === "live") {
          // console.log(myYoutubeObj);
          message.channel.send(myYoutubeObj[0].snippet.channelTitle + "開台中 ->" + `https://www.youtube.com/watch?v=${myYoutubeObj[0].id}&feature=share&ab_channel=${myYoutubeObj[0].channelTitle}`)
          peopleNumYt++;
  //         const exampleEmbed = new Discord.MessageEmbed()
	// .setColor('#0099ff')
  // .setTitle(myYoutubeObj[0].snippet.channelTitle + '開台中')
  // // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setURL(`https://www.youtube.com/watch?v=${myYoutubeObj[0].id}&feature=share&ab_channel=${myYoutubeObj[0].channelTitle}`)
  // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  // .addFields(
	// 	{ name: '已經開台OO', value: 'XX人收看中' },
	// )
  
  // message.channel.send(exampleEmbed);
        // } else if (checkOnlineStatus === "upcoming") {
        //   message.channel.send(myYoutubeObj[0].snippet.channelTitle + "準備開台PEKO ->" + `https://www.youtube.com/watch?v=${myYoutubeObj[0].id}&feature=share&ab_channel=${myYoutubeObj[0].channelTitle}`)
        //   peopleNumYt++;
           }
        })
      }
      
      
      // if (peopleNumYt == 0) {
      //   var singingPeople = singingList[Math.floor(Math.random()*singingList.length)]
      //   message.channel.send("沒人開台，要不" + singingPeople +"唱個歌?")
      // };  
  }
})

//多選(Embed)
client.on('message', message => {
  if(message.content === '123') {
    const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
  .setTitle('live1')
  .addFields(
    { name: 'Inline field title', value: 'https://www.youtube.com/', inline: true },
  ).setURL('https://www.youtube.com/')
  
  message.channel.send(exampleEmbed); 
  }
})

//文字狼人殺出題TEST
let questionNum = 0;
client.on('message', (message) => {
  if (message.content.startsWith("9")) {
    questionNum++;

    //隨機選人
    const tags = client.users.cache.map(u => `${u.id}`)
    let memberIndex = Math.round(Math.random() * (tags.length - 1));
    let chooseMember = tags[memberIndex];
    console.log(chooseMember)


    //隨機選題
    var filterLaomao = question.filter(function(item, index, array) {
      return item.questioner === "laomao";
    })
    let quizIndex = Math.round(Math.random() * (filterLaomao.length - 1))    
    // console.log(filterLaomao[index].quiz[0]) 
    
    //出題
    message.guild.members.cache.forEach(member => {
      if (member.id !== chooseMember && member.id !== "800996914975342593") {
        member.send(filterLaomao[quizIndex].quiz[0])
      } else if (member.id == chooseMember && member.id !== "800996914975342593") {
        member.send(filterLaomao[quizIndex].quiz[1])
      }
    })  ;
    message.channel.send(`第${questionNum}題已傳送題目`)
  } 
});



    // let memberIndex = Math.round(Math.random() * (memberID.length - 1));
  

// var memberNum = function (client, message, arguments) {
//   const guild = client.guilds.get('800997819166621819')
//   var memberCount = guild.members.filter(member => !member.user.bot).size; 
//   console.log(memberCount); 
// }

// memberNum();


client.login(auth.discord_key);