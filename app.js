const express = require('express')
var cors = require('cors');
const axios = require('axios');


const app = express()
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })

 app.use(express.static(__dirname + "/" + 'public'));


app.post('/get_reviews', cors(), function (req, res) {
    //get input from form
    // const inputUrl = req.body.url;
    const inputUrl = JSON.stringify(req.body.url);
    const googleApiKey = "AIzaSyBvTIswfuy5NcROHo_EKAiUwcNHBoYUSH8";

    //checks if input is empty
    if (inputUrl == "") {
        res.end('{"status: "400"}');
    }

    //extracts keywords for search from the url
    const urlParameters = inputUrl.split("/");
    var location = urlParameters[6].split(",");

    const longitude = location[0].slice(1);
    const latitude = location[1];
    const keyword = urlParameters[5].split("+").join("-").toLowerCase();

    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${longitude},${latitude}&radius=1500&type=place&keyword=${keyword}&key=${googleApiKey}`;
    axios.get(searchUrl)
        .then(resp => {
            const place_id = resp.data.results[0].place_id;
            const queryUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${googleApiKey}&placeid=${place_id}&fields=review`
            return axios.get(queryUrl);
        })
        .then(resp => {
            let reviews = resp.data.result.reviews;
            
            res.end(JSON.stringify({status: "200", reviews: reviews}));
        });
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))