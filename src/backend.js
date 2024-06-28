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
const cors = require('cors');

app.use(cors());

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initial intent and fallback counter
let intent = "start";
let fallbackCounter = 0;

io.on('connection', (socket) => {
  console.log('connected');

  socket.on('human', (data) => {
    const input = data.toLowerCase();
    handleInput(socket, input);
  });
});

function handleInput(socket, input) {
  const currentIntent = intents.find(i => i.intent_name === intent);

  // Check if input matches any keywords of the current intent
  if (currentIntent.keywords.length === 0 || currentIntent.keywords.some(keyword => input.includes(keyword))) {
    fallbackCounter = 0; // Reset fallback counter on successful match

    if (currentIntent.intent_name === "date") {
      validateDate(socket, input);
    } else if (currentIntent.intent_name === "time") {
      validateTime(socket, input);
    } else {
      const response = currentIntent.answers[0];
      socket.emit('botmes', response);
      intent = currentIntent.next_expectation;
    }
  } else {
    fallback(socket);
  }
}

// Function to handle fallback logic
function fallback(socket) {
  fallbackCounter++;
  if (fallbackCounter >= 3) {
    fallbackCounter = 0;  // Reset counter
    intent = 'start';  // Reset intent to start
    socket.emit('botmes', "Sorry, I'm having trouble understanding. Let's start over. Hi, how can I help you today?");
  } else {
    socket.emit('botmes', "Sorry, I didn't understand that. Can you please rephrase?");
  }
}

// Specific functions to handle validations for date and time
function validateDate(socket, input) {
  const currentDate = new Date().toISOString().split('T')[0];
  const selectedDate = input.trim();

  if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    if (selectedDate >= currentDate) {
      intent = 'time';
      fallbackCounter = 0;  // Reset fallback counter on successful match
      socket.emit('botmes', "What time do you want to book the appointment? Mention the time in HH:MM format :)");
    } else {
      socket.emit('botmes', 'Please provide a valid date. Date should not be in the past.');
    }
  } else {
    socket.emit('botmes', 'Please provide a valid date in the format YYYY-MM-DD.');
  }
}

function validateTime(socket, input) {
  const timeRegex24Hour = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  if (input.match(timeRegex24Hour)) {
    intent = 'resident_munich';
    fallbackCounter = 0;  // Reset fallback counter on successful match
    socket.emit('botmes', "Is patient a resident of Munich? (yes/no)");
  } else {
    socket.emit('botmes', 'Please provide a valid time in 24-hour format (e.g., 13:00).');
  }
}
