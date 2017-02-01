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

// multi step
const startQuiz = (message) => sendMessageToChannel(message).then(writeUserQuestionRefference(message))
const recordAnswer = (user, answer) => getCurrentQuestion(user, answer).then(writeAnswerData).then()

router.post('/events', function (req, res) {
  console.log('answer event')
  let user = req.body.event.user
  let answer = req.body.event.text
  if (channels.includes(req.body.event.channel) && !req.body.event.bot_id) {
    console.log('writing answer data')
    recordAnswer(user, answer)
  } else {
    console.log('miss in events post')
  }
  res.send('ok')
})

router.post('/start', function (req, res) {
  let message = {
    channel: 'U3ZC0R1RV',
    as_user: true,
    token: configResolver.getConfigVariable('API_TOKEN'),
    text: 'First question??',
    attachments: []
  }
  startQuiz(message)
  res.send('ok')
})

module.exports = router

sendMessageToChannel = (message) => {
  console.log('send message to channel')
  return slack.send('chat.postMessage', message)
}

writeUserQuestionRefference = (message) => {
  console.log('write question reference')

  return firebase.database().ref('questions/' + message.channel).set({
    userId: message.channel,
    question: message.text,
    date: Date.now()
  }).then( resp => {return(message.channel)})
}

getCurrentQuestion = (user, answer) => {
  console.log('get current question')

  return firebase.database().ref('/questions/' + user).once('value').then(snapshot => {
    return {
      'question': snapshot.val().question,
      'user': user,
      'answer': answer
    }
  })
}

writeAnswerData = (data) => {
  console.log('write answer data')
  firebase.database().ref('questions/' + data.user).set({
    userId: data.user,
    question: 'Next question??',
    date: Date.now()
  }).then(data => {
    let message = {
      channel: 'U3ZC0R1RV',
      as_user: true,
      token: configResolver.getConfigVariable('API_TOKEN'),
      text: 'Next question??',
      attachments: []
    }
    startQuiz(message)
  })

  return firebase.database().ref('answers/' + data.user + '/' + Date.now()).set({
    user: data.user,
    answer: data.answer,
    question: data.question,
    date: Date.now()
  })
}
