const express = require('express')
const router = new express.Router()
const slack = require('tinyspeck')
const config = require('config')
const configResolver = require('./../modules/configResolver')
const firebase = require('firebase')
const channels = ['D3YDSKCEL', 'D3Z7WTKGV']
const users = ['U3ZC0R1RV']

const firebaseConfig = {
  apiKey: "AIzaSyDqUXg0apDjKGY5h22oRM1R0crt-iDT7t8",
  authDomain: "communityquiz-26ec5.firebaseapp.com",
  databaseURL: "https://communityquiz-26ec5.firebaseio.com",
  storageBucket: "communityquiz-26ec5.appspot.com",
  messagingSenderId: "56685633993"
};
firebase.initializeApp(firebaseConfig);

router.post('/events', function (req, res) {
  let user = req.body.event.user
  let answer = req.body.event.text
  if (channels.includes(req.body.event.channel) && !req.body.event.bot_id) {
    //console.log('writing answer data')
    writeAnswerData(user, answer)
  } else {
    //console.log('miss in events post')
  }
  res.send('ok')
})

router.post('/start', function (req, res) {

  // slack.send('users.list', {token: configResolver.getConfigVariable('API_TOKEN')}).then(users => {
  //   console.log(users)
  // })

  let message = {
    channel: 'U3ZC0R1RV',
    as_user: true,
    token: configResolver.getConfigVariable('API_TOKEN'),
    text: 'First question??',
    attachments: []
  }

  slack.send('chat.postMessage', message).then(data => {
    writeUserQuestionRefference(message.channel, data.channel, data.message.text)
  })

  res.send('ok')
})

module.exports = router

writeUserQuestionRefference = (userId, channel, question) => {
  firebase.database().ref('questions/' + userId).set({
    userId: userId,
    channel: channel,
    question: question,
    date: Date.now()
  })
}

getCurrentQuestion = (userId) => {
  firebase.database().ref('/questions/' + userId).once('value').then(snapshot => {
    return snapshot.val() || []
  })
}

writeAnswerData = (userId, answer) => {
  // firebase.database().ref('questions/' + userId).set({
  //   userId: userId,
  //   channel: channel,
  //   question: 'Next question??',
  //   date: Date.now()
  // })

  firebase.database().ref('answers/' + userId).set({
    user: userId,
    answer: answer,
    date: Date.now()
  })
}
