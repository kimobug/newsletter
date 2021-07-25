const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: `${process.env.MAILCHIMP_API_URL}`,
    method: "POST",
    headers: {
      Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server start on ${PORT}`));
