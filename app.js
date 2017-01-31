var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const router = require('./controllers')
const slack = require('tinyspeck')

const version = '0.0.2'

app.get('/', function (req, res) {
  console.log('requested main route')
  console.log(req)
  res.send('Hello World!')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)

var port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('listening on port ' + port)
  console.log('version: ' + version)
})
