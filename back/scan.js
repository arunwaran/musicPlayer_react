const fs = require('fs');
const path = require('path');
const filename = "music.json";

module.exports = class scanDirectory{

    constructor(){
      this.indexID = 1;
      this.musicLibraryArray = [];
    }
 
    // initiate search 
    async startSearch(_directoryPath){
      var messageResult = this.readDirectory(_directoryPath);
      return messageResult;
    }
  
    // Finds files and folders in directory path provided
    readDirectory(_pathToFiles){
      var files = fs.readdirSync(_pathToFiles);

      if (files != null){
        files.forEach(item =>{
          var fileOrFolder = this.checkFileFolder(item,_pathToFiles);
    
          // if the return item from 'checkFileFolder' fuction is the same as the item sent then add item to jsonArry 
          if(fileOrFolder === item){
            this.addToMusicLibrary(item,this.indexID,_pathToFiles);
            this.indexID = this.indexID + 1;
          }
        
          // if the return item from 'checkFileFolder' fuction contains a '/' then its a directory path to a folder
          // do a recursive function call with this folder directory path 
          else if (fileOrFolder.includes('/')) {
            this.readDirectory(fileOrFolder)
          }
        })
        
        // write to JSON file
        fs.writeFileSync(filename, JSON.stringify(this.musicLibraryArray));
        return "Done Scaning.";
      }
      return "Not a valid directory";
    }
    
    // check if the item is a supported audio file or if its a folder
    checkFileFolder(item, _pathToFiles){
      if(item.includes('.')){
        let lst = item.split('.');
        let fileExtension = lst[lst.length - 1];
        let nameOfFile = lst[0];
    
        //continue if there is a file extension
        if(fileExtension != null){
          let audioLst = ['aac','mp4','mp3','wav','webm','m4a','AAC','MP4','MP3','WAV','WEBM','WebM','M4A','wma','WMA'];
          //check if file extension is in audioLst
          let checkInLst = audioLst.includes(fileExtension);
          if(checkInLst){
            return item;
          }
          else{
            //not a supported file, exit
            return;
          }
        }
      }
      else{
        //this item is a folder, append the item to the directory path and return the directory path of this folder
        _pathToFiles = _pathToFiles + "/" + item;
        return _pathToFiles;
      }
    }
  
    addToMusicLibrary(item,music_id,_pathToFiles){
      var ob = {};
      ob.id = music_id;
      ob.name = item;
      ob.path = _pathToFiles;
      this.musicLibraryArray.push(ob);
    }
  }