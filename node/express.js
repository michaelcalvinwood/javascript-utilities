const port = 3000
const express = require('express')
const app = express()

app.use(express.static('public'));

// generic middleware
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
  });

/*
    URL encoded bodies such as form submissions
   
    var bodyParser = require('body-parser');

    // Create application/x-www-form-urlencoded parser
    var urlencodedParser = bodyParser.urlencoded({ extended: false })
    app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        first_name:req.body.first_name,
        last_name:req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
    })
*/



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})