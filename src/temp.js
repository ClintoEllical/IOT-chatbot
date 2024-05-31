{
    "intent_name": "date",
    "keywords": ["schedule date","Book date","date","day"],
    "answers": ["Enter Date to book appoinment in YYYY-MM-DD\n "],
    "next_expectation": ""
},
{
    "intent_name": "time",
    "keywords": ["time","show time","movie time","tim"],
    "answers": ["Enter Appoinment time which you preffered in 24hr format Example(13:00) "],
    "next_expectation": ""
},
{
    "intent_name": "seats",
    "keywords": ["prices","seat price","charges","ticket price","price","general","premium","recliner"],
    "answers": ["Age of the patient"],
    "next_expectation": ""
},

{
    
    "intent_name": "city",
    "keywords": ["language","movie language","english","hindi","deutsch"],
    "answers": ["City of residence?"],
    "next_expectation":""
},
{
    
    "intent_name": "movie_type",
    "keywords": ["movie type","3D","2D","3d","2d","animation"],
    "answers": ["Country of residence?"],
    "next_expectation":""
},
{
    
    "intent_name": "seat-number",
    "keywords": ["others","others","Female","Male"],
    "answers": ["Patient sex?"],
    "next_expectation":""
},


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
      case 'email':
        book(socket,input);
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
    socket.emit('botmes', intents[0].answers[0]);
  } else {
    fallback();
  }
}
function book(socket,input){
  let match = intents[1].keywords.filter((keyword) =>
    input.includes(keyword)
  );
  if (match.length !== 0) {
    intent ="moviename";
    socket.emit('botmes', intents[1].answers[0]);
  } else {
    handleBookFallback(socket, input);
  }
}
function cityname(socket,input){
  movieName=input;
  intent="date"
  socket.emit('botmes',intents[2].answers);
  console.log(movieName);

}
function validateDate(socket, input) {
  const currentDate = new Date().toISOString().split('T')[0];
  const selectedDate = input.trim();

  if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    if (selectedDate >= currentDate) {
      date = selectedDate;
      intent = 'time';
      socket.emit('botmes', intents[3].answers);
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
    socket.emit('botmes',intents[4].answers);
    
    console.log(time);
    
  } else {
    socket.emit('botmes', 'Please provide a valid time in 24-hour format or 12-hour format (e.g., 13:00 or 1:00 PM).');
  }
}

function seat_Selection(socket, input) {
  let match = intents[4].keywords.filter((keyword) => input.includes(keyword));

  if (match.length !== 0) {
    selectSeatType(socket, input);
    
  } else {
    socket.emit('botmes', 'Please specify a valid seat type: Premium, General, or Recliner.');
  }
}
function movie_lang(socket,input){
  let match = intents[5].keywords.filter((keyword) => input.includes(keyword));
  movielan=input;
  if (match.length !== 0) {
    select_movie(socket, input);
    
  } else {
    socket.emit('botmes', 'please specify valid language : English , Hindi , Deutsch');
  }
}
function validateMovieType(socket, input) {
  
  
  let match = intents[6].keywords.filter((keyword) => input.includes(keyword));

  if (match.length !== 0) {
    movietype = match.toString();
    intent='seat-number'
    socket.emit('botmes',intents[7].answers[0]);
    console.log(movietype)
    
  } else {
    socket.emit('botmes', 'Please enter a valid movie type (3D or 2D).');
  }
}

function seat_number(socket,input){
  seatnumber=parseInt(input);
  if (isNaN(seatnumber)) {
    socket.emit('botmes', 'Please specify seat number you want (Example: 123 ,023,32');
    return;
  }
  intent='total-adults'
  socket.emit('botmes',intents[8].answers);
  console.log(seatnumber);

}
function adults(socket, input) {
  total_adults = parseInt(input);
  
  if (isNaN(total_adults)) {
    socket.emit('botmes', 'Please enter a valid number for the total number of adults.');
    return;
  }
  
  intent = 'total-children';
  socket.emit('botmes', intents[9].answers);
  console.log(total_adults);
}
function childeren(socket,input){
  total_childeren=parseInt(input);
  if (isNaN(total_childeren)) {
    socket.emit('botmes', 'Please enter a valid number for the total number of childeren.');
    return;
  }
  intent='food-service'
  socket.emit('botmes',intents[10].answers);
  console.log(total_childeren);
}
function food(socket, input) {
  let match = intents[10].keywords.filter((keyword) => input.includes(keyword));

  if (match.length !== 0) {
    foods = match[0]; 
    intent = 'parking-service';
    socket.emit('botmes', intents[11].answers);
    console.log(foods);
  } else {
    socket.emit('botmes', 'Please select a valid food combo from the menu (fries, Burger, popcorn).');
  }
}
function parking(socket, input) {
  let match = intents[11].keywords.filter((keyword) => input.includes(keyword));

  if (match.length !== 0) {
    park = 'Parking reserved for you.';
  } else {
    park = ' parking not needed';
  }

  intent = 'mobile-number';
  socket.emit('botmes', intents[12].answers);
}
function mobile(socket, input) {
  const numberRegex = /\d+/g;
  const numbers = input.match(numberRegex);

  if (!numbers || numbers.length === 0 || numbers[0].length < 10) {
    socket.emit('botmes', 'Please enter a valid mobile number.');
    return;
  }
 

  mobile_number = numbers[0];
  console.log(mobile_number);
  intent = 'email-id';
  socket.emit('botmes', intents[13].answers);
}
function email(socket, input) {
  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(input)) {
    socket.emit('botmes', 'Please enter a valid email address.');
    return;
  }

  email_id = input;
  console.log(email_id);
  intent = 'payment-option';
  socket.emit('botmes', intents[14].answers);
}

function payment(socket, input) {
  

  
  const match = intents[14].keywords.find(keyword => input.toLowerCase().includes(keyword));

  if (match) {
    payment_option = match;
    const confirmation= `your payment option is ${payment_option}`;
    socket.emit('botmes',confirmation);
  
  } else {
    socket.emit('botmes', 'Please select a valid payment option (cash or online).');
    return;
  }
  console.log(payment_option);

  intent = 'Ticket';
  socket.emit('botmes', intents[15].answers);
  ticket(socket);
}

function ticket(socket) {
  const seatPrice = 10; 
  const totalCost = total_adults * seatPrice + total_childeren * 1.5;
  
  message = `Ticket Details:
  Movie Name: ${movieName}
  Date: ${date}
  Time: ${time}
  Seats: ${seats}
  Language: ${movielan}
  Movie Type: ${movietype}
  Seat Number: ${seatnumber}
  Food: ${foods}
  Parking Option: ${park}
  Total Cost: ${totalCost}
  Mobile Number: ${mobile_number}
  Email: ${email_id}`;
  console.log(message);

  socket.emit('botmes', message);
  
  socket.emit('botmes',intents[16].answers);
}


function fallback() {
  // Fallback logic goes here
}


function handleBookFallback(socket, input) {
  // Check if the input contains any keywords related to "yes" or "no"
  let yesMatch = intents[1].keywords.filter((keyword) =>
    input.includes(keyword)
  );
  

  if (yesMatch.length == 0 ) {
    // User provided a response, but it wasn't clear. Ask them to rephrase.
    socket.emit('botmes', "Sorry, I didn't understand your response. Please rephrase it.");
  } else {
    fallback();
  }
}
function selectSeatType(socket, input) {
  let seatType = '';
  let seatPrice = 0;

  if (input.includes('premium')) {
    seatType = 'Premium Seat';
    seatPrice = 2;
  } else if (input.includes('general')) {
    seatType = 'General Seat';
    seatPrice = 1.5;
  } else if (input.includes('recliner')) {
    seatType = 'Recliner Seat';
    seatPrice = 4.5;
  }

  if (seatType !== '' && seatPrice !== 0) {
    seats = `${seatType}: €${seatPrice}`;
    intent = 'movie-language';
    socket.emit('botmes', intents[5].answers);
  } else {
    socket.emit('botmes', 'Please specify a valid seat type: Premium, General, or Recliner.');
  }
  console.log(seats);
  
}
function select_movie(socket, input) {
  let selectedmovie = '';
  

  if (input.includes('english')) {
    selectedmovie = 'english'
  } else if (input.includes('hindi')) {
    selectedmovie = 'hindi'
  } else if (input.includes('deutsch','german')) {
    selectedmovie = 'deutsch'
  }

  if (selectedmovie !== '' ) {
    movie_lang = `${selectedmovie}`;
    intent = 'movie-type';
    socket.emit('botmes', intents[6].answers);
  } else {
    socket.emit('botmes', 'Please specify a valid language from: English , hindi , German');
  }
  console.log(movie_lang);
}



function fallback() {
  // Fallback logic goes here
}


function handleBookFallback(socket, input) {
  // Check if the input contains any keywords related to "yes" or "no"
  let yesMatch = intents[1].keywords.filter((keyword) =>
    input.includes(keyword)
  );
  

  if (yesMatch.length == 0 ) {
    // User provided a response, but it wasn't clear. Ask them to rephrase.
    socket.emit('botmes', "Sorry, I didn't understand your response. Please rephrase it.");
  } else {
    fallback();
  }
}
function selectSeatType(socket, input) {
  let seatType = '';
  let seatPrice = 0;

  if (input.includes('premium')) {
    seatType = 'Premium Seat';
    seatPrice = 2;
  } else if (input.includes('general')) {
    seatType = 'General Seat';
    seatPrice = 1.5;
  } else if (input.includes('recliner')) {
    seatType = 'Recliner Seat';
    seatPrice = 4.5;
  }

  if (seatType !== '' && seatPrice !== 0) {
    seats = `${seatType}: €${seatPrice}`;
    intent = 'movie-language';
    socket.emit('botmes', intents[5].answers);
  } else {
    socket.emit('botmes', 'Please specify a valid seat type: Premium, General, or Recliner.');
  }
  console.log(seats);
  
}
function select_movie(socket, input) {
  let selectedmovie = '';
  

  if (input.includes('english')) {
    selectedmovie = 'english'
  } else if (input.includes('hindi')) {
    selectedmovie = 'hindi'
  } else if (input.includes('deutsch','german')) {
    selectedmovie = 'deutsch'
  }

  if (selectedmovie !== '' ) {
    movie_lang = `${selectedmovie}`;
    intent = 'movie-type';
    socket.emit('botmes', intents[6].answers);
  } else {
    socket.emit('botmes', 'Please specify a valid language from: English , hindi , German');
  }
  console.log(movie_lang);
}