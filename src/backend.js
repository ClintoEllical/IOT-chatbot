const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const json = require('./backend.json');
const intents = json.intents;
const axios = require('axios');
const cors = require('cors');


app.use(cors());


const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



let intent = "start";







io.on('connection', (socket) => {
  console.log('connected');

  socket.on('human', (data) => {
    const input = data.toLowerCase();
    
    switch (intent) {
      case 'start':
        processStartIntent(socket, input);
        break;
        case 'book':
        book(socket,input);
        break;
      case 'p_name':
        name(socket,input);
        break;
      case 'p_age':
        age(socket,input);
        break;
      case 'p_sex':
        sex(socket,input);
        break;
      case 'date':
        validateDate(socket,input);
        break;
      case 'time':
        validateTime(socket,input);
        break;
    }
  });

});



function processStartIntent(socket, input) {
  let match = intents[0].keywords.filter((keyword) =>
    input.includes(keyword)
  );

  if (match.length !== 0) {
    intent ="book";
    console.log("12");
    socket.emit('botmes', intents[0].answers[0]);
  } else {
    fallback();
  }
}

function book(socket, input) {
  console.log("function name");
  let match = intents[1].keywords.filter((keyword) => input.includes(keyword));
  if (match.length !== 0) {
  patient_name = input;
  console.log("if");
  // socket.emit('botmes', intents[1].answers);
  intent = 'p_name';
  socket.emit('botmes', intents[1].answers);
  }
}

function name(socket, input) {
  console.log("function name");

  patient_name = input;
  console.log("if");
  // socket.emit('botmes', intents[1].answers);
  intent = 'p_age';
  socket.emit('botmes', intents[2].answers);
  }



function age(socket, input) {
  let match = intents[2].keywords.filter((keyword) => input.includes(keyword));
  if (match.length !== 0) {
    patient_age = input;
  } else {
    fallback();
  }
  intent = 'p_sex';
  socket.emit('botmes', intents[3].answers);
}


function sex(socket, input) {
  let match = intents[3].keywords.filter((keyword) => input.includes(keyword));
  if (match.length !== 0) {
    patient_age = input;
  } else {
    fallback();
  }
  intent = 'date';
  socket.emit('botmes', intents[4].answers);
}


function validateDate(socket, input) {
  const currentDate = new Date().toISOString().split('T')[0];
  const selectedDate = input.trim();

  if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    if (selectedDate >= currentDate) {
      date = selectedDate;
      intent = 'time';
      socket.emit('botmes', intents[5].answers);
      console.log(date);
    } else {
      socket.emit('botmes', 'Please provide a valid date. Date should not be in the past.');
    }
  } else {
    socket.emit('botmes', 'Please provide a valid date in the format YYYY.MM.DD .');
  }
}


function validateTime(socket, input) {
  const timeRegex12Hour = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(am|pm)$/i;
  const timeRegex24Hour = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (input.match(timeRegex12Hour)) {
    const [_, hour, minutes, period] = input.match(timeRegex12Hour);
    const isAM = period.toLowerCase() === 'am';
    const hour24 = isAM ? (hour === '12' ? '00' : hour) : String(Number(hour) + 12);
    time = `${hour24}:${minutes}`;
  } else if (input.match(timeRegex24Hour)) {
    time = input;
  }
  if (time) {
    intent='seat'
    socket.emit('botmes',intents[6].answers);
    console.log(time);
  } else {
    socket.emit('botmes', 'Please provide a valid time in 24-hour format or 12-hour format (e.g., 13:00 or 1:00 PM).');
  }
}








