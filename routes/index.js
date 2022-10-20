var express = require('express');
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const url = require('url');

const router = express();
router.use(bodyParser.json());

const event_L = {
  'summary': 'Hi Aman, Let us meet',
  'location': 'Gautam Budda University, Greater NOIDA',
  'description': 'A chance to meet with me.',
  'start': {
    'dateTime': '2022-09-28T09:00:00-05:30',
    'timeZone': 'Asia/Delhi',
  },
  'end': {
    'dateTime': '2022-09-28T10:00:00-05:30',
    'timeZone': 'Asia/Delhi',
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lacm1546@gmail.com'}
  ],
  'reminders': {
    'useDefault': true,
    // 'overrides': [
    //   {'method': 'email', 'minutes': 24 * 60},
    //   {'method': 'popup', 'minutes': 10},
    // ],
  },
};

const oauth2Client = new google.auth.OAuth2(
  "842134020386-85iacjs1smm9e923hurunt1l4gi3gp5m.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/"
);

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  scope: scopes,
  include_granted_scopes: true
});

let userCredential = null;

// router.get('/googleAuth', (req, res, next) => {
//   res.redirect(authorizationUrl);
//   // res.statusCode = 200;
//   // res.setHeader("Content-Type", 'application/json');
//   // res.json({status:true});
// });


router.post('/', (req, res, next) => {

    console.log("req.body: ", req.body);
    oauth2Client.setCredentials(req.body);

    userCredential = req.body;

    // console.log("oauth2Client====", response.tokens);
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});


    // calendar.events.insert({
    //   auth: oauth2Client,
    //   calendarId: 'primary',
    //   resource: event_L,
    // }, function(err, event) {
    //   if (err) {
    //     console.log('There was an error contacting the Calendar service: ' + err);
    //     return;
    //   }
    //   console.log('Event created: %s', event.data);
    // });
    

    calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    })
    .then((result) => {
         console.log(result.data.items);

         const events = result.data.items;
         if (!events || events.length === 0) {
          console.log('No upcoming events found.');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({eventStatus:"No upcoming events found."});
          return;
        }
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch((err) => {
    console.log("Error----", err);
    err = new Error('Error occured in result!');
    res.statusCode = 403;
    return next(err);
    });
});

module.exports = router;
