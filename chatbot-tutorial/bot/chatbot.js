/******************************************\
| ANN Based Chat Bot for Discord           |
| By Axiom Gaming YT                       |
| June 18, 2021                            |
\******************************************/
const Discord = require('discord.js'); // load in discord.js library
const client = new Discord.Client(); // creates a new discord client
const fs = require('fs'); // used to read text files
const brain = require('brain.js'); // load in brain.js library
const net = new brain.recurrent.LSTM({ // create a new neural net.
	activation: 'leaky-relu' // use this activation because. :)
});


// read in the token.
// use npm dotenv for a better way to handle this.
var token = JSON.parse(fs.readFileSync("./token/token.json", 'utf8'));


const channelID = "#"; // A specific channel ID for the bot to use.
const botID = "855737749357068308"; // *REQUIRED* The ID of the bot. 


/******************************************\
| Function called when the bot is ready to |
| be used.                                 |
\******************************************/
client.on('ready', () => {
	// load the neural net
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	console.log('bot ready...');
});


/******************************************\
| Called when any message is sent on any   |
| channel in the guild the bot is in.      |
| This is the function we use to handle    |
| messages sent by users.                  |
\******************************************/
client.on('message', msg => {
	
	// if the message is empty just exit the function.
	if(msg.content == "") {
		return;
	}

	// is the sender is not the bot it must be a user
	// remove any numbers and symbols and only send words
	// to the ANN for processing.
	if (msg.author.id !== botID /*&& msg.channel.id === channelID*/) {
		
		// reads the contents of the message.
		var words = msg.content;
		
		// remove everything but letters.
		var sentence = words.replace(/[^a-zA-Z ]+/g, "").toLowerCase();
		
		// sends the reply to the channel.
		msg.channel.send(reply(net.run(sentence)));
	}
});


/******************************************\
| Login to Discord: App Entry Point        |
\******************************************/
client.login(token.token);


/******************************************\
| Response Arrays                          |
| These lists can be added to for more     |
| randomness in the responses.             |
\******************************************/
var hello_reply = ["hi","sup?","yo","hello"];
var bye_reply = ["bye","cya","good bye"];
var lol_reply = ["lol","lmao","heh","funny"];
var weather_reply = ["yes what a nice day it is today","how is it outside where you are?","thats perfect weather"];
var yes_reply = ["thats the spirit","ok then","i agree"];
var no_reply = ["why not?","NO!","YES!","ok then"];
var help_reply = ["id help you but im just a bot","is there anyone who can assist?","Id like to help."];


/*******************************************\
| This function takes the output of the ANN |
| and returns a random reply string based   |
| on that topic. If there is no match it    |
| returns a thinking emoji.                 |
\*******************************************/
const reply = (intent) => {
	
	// the the intent is blank for some reason, return a thinking emoji.
	if(intent === "") return ":thinking:";
	
	// used to build a return sentence.
	var retstr = "";

	// the neural net will generate a number between 1-8
	// which should correspond to a topic.
	// if it doesn't recognise the intent for some reason
	// it will return a thinking emoji.
	switch(parseInt(intent)) {
		case 1:
			retstr = hello_reply[Math.floor(Math.random()*hello_reply.length)];
		break;
		case 2:
			retstr = bye_reply[Math.floor(Math.random()*bye_reply.length)];
		break;
		case 3:
			retstr = lol_reply[Math.floor(Math.random()*lol_reply.length)];
		break;
		case 4:
			retstr = weather_reply[Math.floor(Math.random()*weather_reply.length)];
		break;
		case 5:
			retstr = yes_reply[Math.floor(Math.random()*yes_reply.length)];
		break;
		case 6:
			retstr = no_reply[Math.floor(Math.random()*no_reply.length)];
		break;
		case 7:
			retstr = greeting();
		break;
		case 8:
			retstr = help_reply[Math.floor(Math.random()*help_reply.length)];
		break;
		default:
			retstr = ":thinking:";
		break;
	}
	
	return retstr;
}


/******************************************\
| Builds a random greeting reply.          |
\******************************************/
const greeting = () => {

	var terms = ["how are you?","hows it going?","how are you doing?"];
	var str = "";
    str += terms[Math.floor(Math.random() * terms.length)] + " ";
    
	if(Math.random() >= 0.8)
	{
		str += "I dont know about ";
		switch(Math.floor(Math.random()*3)) {
			case 0:
				str += "everyone else but ";
			break;
			case 1:
				str += "you but ";
			break;
			case 2:
				str += "them but ";
			break;
			
			default:break;
		}
	}
	
	str += "im ";

	if(Math.random() >= 0.7)
	{
		var things = ["feeling ","doing ","being ", "genuinely "];
		str += things[Math.floor(Math.random()*things.length)];
	}
	
    var feelings = ["great. ","playful. ","calm. ","confident. ","courageous. ","peaceful. ",
        "tragic. ","neutral. ","anxious. ","pained. ","wary. "];
            
	str += feelings[Math.floor(Math.random()*feelings.length)];
	
	if(Math.random() >= 0.8)
	{
		var reasons = ["for some reason ", "just because ", "becasue i can "];
        str += reasons[Math.floor(Math.random() * reasons.length)];
        
        if(Math.random() >= 0.5)
        {
            str += "thanks for asking. ";
        } else {
            str += ". ";
        }
    }
    return str;
}