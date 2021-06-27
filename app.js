var express = require("express");
const fetch = require('node-fetch')
// var https = require('https')
var app = express();

const xml2js = require('xml2js');
const fs = require('fs');
// const parser = new xml2js.Parser();

// const xml = fs.readFileSync('flickr.json');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/url", (req, res, next) => {
    console.log("[Tony,Lisa,Michael,Ginger,Food]")
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.get('/flickr', async (req, res) => {
    try {
        let json = []
        const apiResponse = await fetch(
            'http://api.flickr.com/services/feeds/photos_public.gne'
        )

        // result in xml
        const apiResponseXml = await apiResponse.text()

        // converting xml to json using xml2js
        xml2js.parseString(apiResponseXml, { mergeAttrs: true, trim: true }, (err, result) => {
            if(err) {
                throw err;
            }
            json = JSON.stringify(result, null, 4);
            console.log(json)
        })

        // save JSON in a file
        fs.writeFileSync('flickr.json', json)

        // res.send(JSON.stringify(json))
        res.status(200).json(JSON.parse(json));
    //   res.send('Done – check console log')
    } catch (err) {

        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

app.listen(8001, () => {
    console.log("Server running on port 8001");
});