var express = require('express')
var app = express()

const version = '0.0.1'

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('listening on port ' + port)
  console.log('version: ' + version)
})
