// Setup NPM libraries
const express = require("express");
const bodyParser = require("body-parser");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fileUpload = require("express-fileupload");
const fs = require("fs");
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage()
});

// Import functions in from the other JS files
const mediatosummary = require(__dirname + "/public/scripts/mediatosummary.js");
const youtubesub = require(__dirname + "/public/scripts/youtubesubtitles.js");
const askprofessor = require(__dirname + "/public/scripts/askprofessor.js");

// Setup server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = process.env.port || 80;
app.set('view engine', 'jade');
app.use(express.static('public'));


//configure fileupload middleware
app.use(fileUpload({
    useTempFile: true,
    truetempFileDir: "/tmp/"
}))

//Functions (Have diff requests for each file type)
app.post('/uploadMP4', async (req, res) => {
    console.log("Post request received: /uploadMP4");
    if (req.files) {
        console.log(req.files);
        var file = req.files.mp4;
        console.log(file);
        var filename = file.name;
        console.log(filename);

        file.mv('./tmp/' + filename, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
        var result = "";
        result += "<h1>Transcript</h1>";
        result += "<p>" + summary.transcript + "</p><br><br>";
        result += "<h1>Topics</h1>";
        for (var i = 0; i < summary.topics.length; i++) {
            result += "<h3>" + summary.topics[i].title + "</h3>";
            result += "<p>" + summary.topics[i].summary + "</p>";
            result += "<a href=\"" + summary.topics[i].link + "\" target=_blank>" + summary.topics[i].link + "</a><br><br>";
            if (summary.topics[i].articles[0] != null) {
                result += ("<p>Current Event:</p><p><strong>" + summary.topics[i].articles[0].author + " / " + summary.topics[i].articles[0].source.name + " / " + summary.topics[i].articles[0].publishedAt.substring(0, 10) + " / " + summary.topics[i].articles[0].title + ": </strong> " + summary.topics[i].articles[0].description + " </p><a href=\"" + summary.topics[i].articles[0].url + "\" target=_blank>" + summary.topics[i].articles[0].url + "</a><br><br>");
                result += "<img src='" + summary.topics[i].articles[0].urlToImage + "' alt='" + summary.topics[i].articles[0].title + "' style='max-width:50%'></img><br><br><br>";
            }
        }
        res.write("<!DOCTYPE html><html><body>" + result + "</body></html>")
        res.end();
    } else {
        console.log('Error');
    }

});

//Functions (Have diff requests for each file type)
app.post('/uploadMP3', async (req, res) => {
    console.log("Post request received: /uploadMP3");
    if (req.files) {
        console.log(req.files);
        var file = req.files.mp3;
        console.log(file);
        var filename = file.name;
        console.log(filename);

        file.mv('./tmp/' + filename, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
        var result = "";
        result += "<h1>Transcript</h1>";
        result += "<p>" + summary.transcript + "</p><br><br>";
        result += "<h1>Topics</h1>";
        for (var i = 0; i < summary.topics.length; i++) {
            result += "<h3>" + summary.topics[i].title + "</h3>";
            result += "<p>" + summary.topics[i].summary + "</p>";
            result += "<a href=\"" + summary.topics[i].link + "\" target=_blank>" + summary.topics[i].link + "</a><br><br>";
            if (summary.topics[i].articles[0] != null) {
                result += ("<p>Current Event:</p><p><strong>" + summary.topics[i].articles[0].author + " / " + summary.topics[i].articles[0].source.name + " / " + summary.topics[i].articles[0].publishedAt.substring(0, 10) + " / " + summary.topics[i].articles[0].title + ": </strong> " + summary.topics[i].articles[0].description + " </p><a href=\"" + summary.topics[i].articles[0].url + "\" target=_blank>" + summary.topics[i].articles[0].url + "</a><br><br>");
                result += "<img src='" + summary.topics[i].articles[0].urlToImage + "' alt='" + summary.topics[i].articles[0].title + "' style='max-width:50%'></img><br><br><br>";
            }
        }
        res.write("<!DOCTYPE html><html><body>" + result + "</body></html>")
        res.end();
    } else {
        console.log('Error');
    }

});

app.post('/uploadIMG', upload.array("myFiles[]"), async (req, res) => {
    console.log("Post request received: /uploadIMG");
    var transcript = await mediatosummary.trascribeImage(req.files[0].buffer);
    var summary = await mediatosummary.getInfo(transcript);
    var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
    var result = "";
    result += "<h1>Transcript</h1>";
    result += "<p>" + summary.transcript + "</p><br><br>";
    result += "<h1>Topics</h1>";
    for (var i = 0; i < summary.topics.length; i++) {
        result += "<h3>" + summary.topics[i].title + "</h3>";
        result += "<p>" + summary.topics[i].summary + "</p>";
        result += "<a href=\"" + summary.topics[i].link + "\" target=_blank>" + summary.topics[i].link + "</a><br><br>";
        if (summary.topics[i].articles[0] != null) {
            result += ("<p>Current Event:</p><p><strong>" + summary.topics[i].articles[0].author + " / " + summary.topics[i].articles[0].source.name + " / " + summary.topics[i].articles[0].publishedAt.substring(0, 10) + " / " + summary.topics[i].articles[0].title + ": </strong> " + summary.topics[i].articles[0].description + " </p><a href=\"" + summary.topics[i].articles[0].url + "\" target=_blank>" + summary.topics[i].articles[0].url + "</a><br><br>");
            result += "<img src='" + summary.topics[i].articles[0].urlToImage + "' alt='" + summary.topics[i].articles[0].title + "' style='max-width:50%'></img><br><br><br>";
        }
    }
    res.write("<!DOCTYPE html><html><body>" + result + "</body></html>")
    res.end();
});

app.post('/uploadYoutube', async (req, res) => {
    console.log("Post request received: /uploadYoutube");
    var link = req.body["uploadYoutube-link"];
    console.log(link);
    var transcript = await youtubesub.transcript(link);
    var summary = await mediatosummary.getInfo(transcript);
    var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
    var result = "";
    result += "<h1>Transcript</h1>";
    result += "<p>" + summary.transcript + "</p><br><br>";
    result += "<h1>Topics</h1>";
    for (var i = 0; i < summary.topics.length; i++) {
        result += "<h3>" + summary.topics[i].title + "</h3>";
        result += "<p>" + summary.topics[i].summary + "</p>";
        result += "<a href=\"" + summary.topics[i].link + "\" target=_blank>" + summary.topics[i].link + "</a><br><br>";
        if (summary.topics[i].articles[0] != null) {
            result += ("<p>Current Event:</p><p><strong>" + summary.topics[i].articles[0].author + " / " + summary.topics[i].articles[0].source.name + " / " + summary.topics[i].articles[0].publishedAt.substring(0, 10) + " / " + summary.topics[i].articles[0].title + ": </strong> " + summary.topics[i].articles[0].description + " </p><a href=\"" + summary.topics[i].articles[0].url + "\" target=_blank>" + summary.topics[i].articles[0].url + "</a><br><br>");
            result += "<img src='" + summary.topics[i].articles[0].urlToImage + "' alt='" + summary.topics[i].articles[0].title + "' style='max-width:50%'></img><br><br><br>";
        }
    }
    res.write("<!DOCTYPE html><html><body>" + result + "</body></html>")
    res.end();
});

app.post('/uploadKeyWords', (req, res) => {
    console.log("Post request received: /uploadKeyWords");
    console.log(req.body);
    var keyWordString = req.body["keyWords"];
    //var topics = mediatosummary.tokenize(keyWordString); //return array

    var summary = await mediatosummary.getSummaryFromVideo("tmp/" + filename);
    var result = "";
    result += "<h1>Transcript</h1>";
    result += "<p>" + summary.transcript + "</p><br><br>";
    result += "<h1>Topics</h1>";
    for (var i = 0; i < summary.topics.length; i++) {
        result += "<h3>" + summary.topics[i].title + "</h3>";
        result += "<p>" + summary.topics[i].summary + "</p>";
        result += "<a href=\"" + summary.topics[i].link + "\" target=_blank>" + summary.topics[i].link + "</a><br><br>";
        if (summary.topics[i].articles[0] != null) {
            result += ("<p>Current Event:</p><p><strong>" + summary.topics[i].articles[0].author + " / " + summary.topics[i].articles[0].source.name + " / " + summary.topics[i].articles[0].publishedAt.substring(0, 10) + " / " + summary.topics[i].articles[0].title + ": </strong> " + summary.topics[i].articles[0].description + " </p><a href=\"" + summary.topics[i].articles[0].url + "\" target=_blank>" + summary.topics[i].articles[0].url + "</a><br><br>");
            result += "<img src='" + summary.topics[i].articles[0].urlToImage + "' alt='" + summary.topics[i].articles[0].title + "' style='max-width:50%'></img><br><br><br>";
        }
    }
    res.write("<!DOCTYPE html><html><body>" + result + "</body></html>")
    res.end();
});

app.post('/uploadTXT', (req, res) => {

});

app.post('/getAnswer', (req, res) => {
    (async () => {
        var data = await askprofessor.askQuestion(req.body.Question[0].question);
        res.send(JSON.stringify(data)); // Sends the results
    })()
});

// Webpages
app.get("/", function (req, res) {
    console.log(req.url + "@" + Date() + " User connected to the Website");
    res.render('index');
});

app.get("/application", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use application");
    res.render('application');
});

app.get("/about", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use about");
    res.render('about');
});

app.get("/index", function (req, res) {
    console.log(req.url + "@" + Date() + " User requested to use homepage");
    res.render('index');
});

app.get('/ask', (req, res) => {
    console.log(req.url + "@" + Date() + " User requested to ask the professor");
    res.render('ask');
});

// Turns on Server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});