const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs');
const port = 5000;
const { send } = require('process');
const scanDirectory = require('./back/scan');

const musicLibraryFile = './music.json';
var musicData =  null;

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

// scan directory for music 
app.get('/directory', async function(req,res){
    let musicDirectory = req.query.directory;

    if(musicDirectory != null){

        let messageResult = "";
        let scanDir = new scanDirectory();
        try{
            messageResult = await scanDir.startSearch(musicDirectory);
        }
        catch(err){
            messageResult = "Enter a valid Directory.";
        }

        let obj = {"status": messageResult};
        res.json(obj);
    }
});


// send JSON data of music library
app.get('/songs', function(req,res){
    let obj = {
        "message": null,
        "songs":null
    }
    if (musicData != null){
        obj.songs = musicData;
    }
    else{
        obj.message = "Need to scan for music";
    }

    res.json(obj);
});

// find song based on ID and send music file 
app.get('/song/:id', function(req,res){
    let songId = parseInt(req.params.id);

    if (Number.isInteger(songId)){
        let songItem = musicData.filter(item => item.id == songId)[0];
        console.log(songItem);
        let fullPathToSong = songItem.path + "/" + songItem.name;
        console.log(fullPathToSong);
        res.sendFile(fullPathToSong);
    }
});

// check if song with the specified ID exists and send info
app.get('/checksong/:id', function(req,res){
    let songId = parseInt(req.params.id);

    if (Number.isInteger(songId)){
        
        let songItem = musicData.filter(item => item.id == songId)[0];
        let obj = {"id":null, "name":null};

        if (songItem != null){
            obj.id = songId
            obj.name = songItem.name;
        }

        else{
            let songItemForId1 = musicData.filter(item => item.id == 1)[0];
            obj.id = 1
            obj.name = songItemForId1.name;
        }

        res.json(obj);
    }
});

app.use(express.static("public"));

app.listen(port, () => {

    //read json file containing music info
    if(fs.existsSync(musicLibraryFile)){
       musicData = JSON.parse(fs.readFileSync(musicLibraryFile));
    }

    console.log("on port: "+ port);
});