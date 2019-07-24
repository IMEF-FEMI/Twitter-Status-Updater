require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const formData = require("express-form-data");
var Twitter = require("twitter");
var async = require("async");
const fs = require("fs");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(formData.parse());

app.post("/update-status", (req, res) => {
  var client = new Twitter({
    consumer_key: process.env.consumerKey,
    consumer_secret: process.env.consumerSecret,
    access_token_key: process.env.accessToken,
    access_token_secret: process.env.secret
  });

  if (req.files) {
    // if media is included
    var media_ids = "";

    async.each(
      req.files,
      function(file, callback) {
        var params = {
          media: fs.readFileSync(file.path)
        };

        client.post("media/upload", params, async function(
          error,
          media,
          response
        ) {
          if (!error && response.statusCode === 200) {
            console.log("media uploaded");
            media_ids += `${media.media_id_string},`;
            callback();
          } else {
            return callback(error);
          }
        });
      },
      function(error) {
        var status = {
          status: JSON.parse(req.body.tweet_text),
          media_ids: media_ids // Pass the media id string
        };
        client.post("statuses/update", status, async function(
          error,
          tweet,
          response
        ) {
          if (!error) {
            console.log("status updated");
            res.status(200).send({ success: "status updated" });
          } else {
            res.status(400).json(error);
          }
        });
      }
    );
  } else {
    // when no photo/video is included
    var status = {
      status: JSON.parse(req.body.tweet_text)
    };
    client.post("statuses/update", status, async function(
      error,
      tweet,
      response
    ) {
      if (!error) {
        console.log("status updated");
        res.status(200).send({ success: "status updated" });
      } else {
        console.log(error);
        res.status(400).json(error);
      }
    });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("listening at port 8080");
});
module.exports = app;
