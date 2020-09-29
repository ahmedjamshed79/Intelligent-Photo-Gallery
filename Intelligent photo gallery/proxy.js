var http = require('https');
var request = require("request");
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const API_KEY = "dc140afe3fd3a251c2fdf9dcd835be5c";
const interestingReq = "https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&per_page=40&safe_search=1&format=json&nojsoncallback=1&api_key="+API_KEY;


http.createServer(function (req, res) {
    request(interestingReq, function(error, response, body){
    // construct the JSON response to send back to client
    res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "*"});
    res.write(JSON.stringify(body)); //write a response to the client in JSON
    res.end(); //end the response
    });
}).listen(3001); 