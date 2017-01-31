const express = require('express')
const router = new express.Router()
const eventsController = require('./eventsController')

router.use(eventsController)

module.exports = router
