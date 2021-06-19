/******************************************\
| ANN Training Program for a Chat Bot      |
| By Axiom Gaming YT                       |
| June 18, 2021                            |
\******************************************/
const fs = require('fs'); // used to read files
const brain = require('brain.js'); // load the brain
const net = new brain.recurrent.LSTM({ // create a new ann
	activation: 'leaky-relu' // using this activation because.
});

var trainingData = []; // hold our training data


/******************************************\
| Read training data from a JSON file.     |
| Begin training a new neural net.         |
\******************************************/
function loadInitialTraining()
{
	train(JSON.parse(fs.readFileSync('conversation-data.json')));
}


/******************************************\
| Creates a neural net from the training   |
| data file and reads in the training data |
| from the JSON files.                     |
\******************************************/
function loadTraining()
{
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	train(JSON.parse(fs.readFileSync('conversation-data.json')));
}


/******************************************\
| Saves the neural net training data.      |
\******************************************/
function saveTrainingData()
{
	try {
		fs.writeFile('neuralnet.json', JSON.stringify(net.toJSON()), (err, result) => {
			if(err) console.log("error:" + err);
		});
	}catch(err){
		console.log(err);
	}
}


/******************************************\
| Creates a neural net from the training   |
| data and runs the test input function.   |
\******************************************/
function testTrainingModel()
{
	net.fromJSON(JSON.parse(fs.readFileSync('neuralnet.json', 'utf8')));
	boot();
}


/******************************************\
| Train the neural net based on the data   |
| using variable settings and saves the    |
| training data when the iterations are    |
| complete.                                |
\******************************************/
const train = (dt) => {
	
	console.log("Training.");
	
	const d = new Date();
	
	net.train(dt, {
		iterations: 100,
		log: true,
		errorThresh: 0.001,
		logPeriod: 5,
		momentum: 0.1,
		learningRate: 0.001
	});
	
	saveTrainingData();
	
	console.log(`Finished in ${(new Date() - d) / 1000} s`);
}


/******************************************\
| Program Entry Point                      |
\******************************************/
const init = () =>
{
	loadInitialTraining();
	//loadTraining();
	//testTrainingModel();
}
init();


/******************************************\
| Test function takes the users input      |
| and runs it through the ANN and returns  |
| a number result. That number is used     |
| as a Topic ID and a reply is generated.  |
\******************************************/
const boot = () => {
	rl.question("Enter: ", (q)=>{
		var qs = q.replace(/[^a-zA-Z ]+/g, "").toLowerCase();
		console.log(reply(net.run(qs)));
		boot();
	});
}


/******************************************\
| Response Arrays                          |
\******************************************/
var hello_reply = ["hi","sup?","yo","hello"];
var bye_reply = ["bye","cya","good bye"];
var lol_reply = ["lol","lmao","heh","funny"];
var weather_reply = ["what a nice day today","how is it outside?","thats perfect weather"];
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
	
	if(intent === "") return ":thinking:";
	
	var retstr = "";

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