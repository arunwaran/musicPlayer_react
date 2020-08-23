const scanDirectory = require('./scan');


function testScan(musicDirectory){
    let scanDir = new scanDirectory();
    scanDir.startSearch(musicDirectory)
    .then(messageResult => console.log(messageResult))
    .catch(err => console.log("error: "+err));
}


// creates music.json file with all the music found in testDirectory1 path
const testDirectory1 = '/home/arun/Music';
testScan(testDirectory1);


// throws error message because no such diiectory exists
const testDirectory2 = '/home/arun/music';
testScan(testDirectory2);


