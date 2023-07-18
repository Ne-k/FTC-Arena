const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Schema = require("./Schema/Scores")
const os = require('os');
const fs = require('fs');
const networkInterfaces = os.networkInterfaces();
const ipAddress = networkInterfaces['Ethernet 3'][0]['address'];
const {join} = require("path");
const connectionString = "mongodb+srv://7034:7034@cluster0.swlcios.mongodb.net/gobuildacomp?retryWrites=true&w=majority"
const app = express();
app.use(express.json());
app.use(cors());

const configPath = join("../website/src/ip.json");
const config = require(configPath);

const UPDATE_INTERVAL = 2000; // Update every 5 seconds

async function getLatestMatch() {
    const response = await fetch(`http://${ipAddress}:3001/api/latestId`);
    if (response.status === 404) {
        return null;
    }
    const latestId = await response.text();
    return Schema.findById(latestId);
}


async function writeDataToFiles(data) {
    let redTeamScore = 0;
    let blueTeamScore = 0;
    let matchNumber = 0;
    let red1TeamName = '';
    let red2TeamName = '';
    let blue1TeamName = '';
    let blue2TeamName = '';
    if (data) {
        redTeamScore = data.red1 + data.red2;
        blueTeamScore = data.blue1 + data.blue2;
        matchNumber = data.matchNumber;
        red1TeamName = data.red1TeamName;
        red2TeamName = data.red2TeamName;
        blue1TeamName = data.blue1TeamName;
        blue2TeamName = data.blue2TeamName;
    }
    const text1 = `${redTeamScore}`;
    const text2 = `${blueTeamScore}`;
    const text3 = `${matchNumber}`;
    const text4 = `${red1TeamName}\n${red2TeamName}`;
    const text5 = `${blue1TeamName}\n${blue2TeamName}`;
    fs.writeFileSync("./livescores/RedTeamScores.txt", text1);
    fs.writeFileSync("./livescores/BlueTeamScores.txt", text2);
    fs.writeFileSync("./livescores/LatestMatchNumber.txt", text3);
    fs.writeFileSync("./livescores/RedTeamNames.txt", text4);
    fs.writeFileSync("./livescores/BlueTeamNames.txt", text5);
}

async function updateScores() {
    const latestMatch = await getLatestMatch();
    await writeDataToFiles(latestMatch);
}

app.put('/api/updateScore/:id', async (req, res) => {
    const { red1, red2, blue1, blue2 } = req.body;
    const score = await Schema.findByIdAndUpdate(req.params.id, { red1, red2, blue1, blue2 }, { new: true });
    res.send(score);
});
app.get('/api/matchByNumber/:matchNumber', async (req, res) => {
    const match = await Schema.findOne({ matchNumber: req.params.matchNumber });
    res.json(match);
});
app.get('/api/latestId', async (req, res) => {
    const latest = await Schema.findOne().sort({ _id: -1 });
    if (!latest) {
        res.status(404).send('No matches found');
        return;
    }
    res.send(latest._id.toString());
});


app.get('/api/latestMatch', async (req, res) => {
    const latestMatch = await Schema.findOne().sort({ createdAt: -1 });
    res.json(latestMatch);
});
app.post('/api/newMatch', async (req, res) => {
    const { matchNumber, red1, red2, blue1, blue2, red1TeamName, red2TeamName, blue1TeamName, blue2TeamName } = req.body;
    const existingMatch = await Schema.findOne({ matchNumber });
    if (existingMatch) {
        res.json(existingMatch);
    } else {
        const newMatch = new Schema({ matchNumber, red1, red2, blue1, blue2, red1TeamName, red2TeamName, blue1TeamName, blue2TeamName });
        await newMatch.save();
        res.json(newMatch);
    }
});
app.put('/api/updateTeamNames/:id', async (req, res) => {
    const { red1TeamName, red2TeamName, blue1TeamName, blue2TeamName } = req.body;
    const score = await Schema.findByIdAndUpdate(
        req.params.id,
        { red1TeamName, red2TeamName, blue1TeamName, blue2TeamName },
        { new: true }
    );
    res.send(score);
});


app.get('/api/teams', async (req, res) => {
    try {
        // Get all the matches from the database
        const matches = await Schema.find();

        // Calculate the total score for each team
        const teams = {};
        for (const match of matches) {
            teams[match.red1TeamName] = (teams[match.red1TeamName] || 0) + match.red1;
            teams[match.red2TeamName] = (teams[match.red2TeamName] || 0) + match.red2;
            teams[match.blue1TeamName] = (teams[match.blue1TeamName] || 0) + match.blue1;
            teams[match.blue2TeamName] = (teams[match.blue2TeamName] || 0) + match.blue2;
        }

        // Convert the teams object to an array of objects
        const teamsArray = Object.entries(teams).map(([name, score]) => ({ name, score }));
        res.json(teamsArray)
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the leaderboard data');
    }
});

app.get('/api/getdb', async (req, res) => {
    const data = await Schema.find()
    res.send(data);
});

app.listen(3001, ipAddress, () => {
    console.log(`Listening on ${ipAddress}:${3001}...`)
    config.ip = ipAddress;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
});

mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
        setInterval(updateScores, UPDATE_INTERVAL);
    })
    .catch(err => console.error('Could not connect to MongoDB', err));
