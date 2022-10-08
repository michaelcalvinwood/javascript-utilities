const serverKey = '';
const serverCert = '';
const httpsPort = 3000;

const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();

app.get("/", function (req, res) {
  res.send("hello world");
});

https
  .createServer(
    {
      key: fs.readFileSync(serverKey),
      cert: fs.readFileSync(serverCert),
    },
    app
  )
  .listen(httpsPort, () => {
    console.log(
      `App listening on port ${httpsPort}`
    );
  });
