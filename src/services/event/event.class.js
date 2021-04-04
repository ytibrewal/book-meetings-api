
const config_data = require('../../../config/default').google_calander;
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = config_data.scopes;
const TOKEN_PATH = config_data.tokenpath;

exports.Event = class Event {

  async find(params) {
    return new Promise(function (resolve, reject) {
      fs.readFile('credentials.json', async function (err, content) {
        if (err) return console.log('Error loading client secret file:', err);
        var i = await authorize(JSON.parse(content), new Date(), listEvents);
        resolve(i);
      });
    });
  }


  async create(data, params) {
    data.end = data.start;
    var event = {
      'summary': 'Meeting with ' + data.name,
      'start': {
        'dateTime': new Date(data.start),
        'timeZone': "Asia/Kolkata",
      },
      'end': {
        'dateTime': new Date(new Date(data.start).getTime() + (30 * 60 * 1000)),
        'timeZone': "Asia/Kolkata",
      },
      'attendees': [
        { 'email': data.email },
        { 'email': 'ytibrewal.yash@gmail.com' },
      ]
    };

    var _events = await new Promise(function (resolve, reject) {
      fs.readFile('credentials.json', async function (err, content) {
        if (err) return console.log('Error loading client secret file:', err);
        var i = await authorize(JSON.parse(content), new Date(new Date(data.start) - (1000 * 60 * 30)), listEvents);
        resolve(i);
      });
    });


    for (var x in _events) {
      var booked_events = (_events[x]);
      booked_events.start.dateTime = new Date(booked_events.start.dateTime);
      booked_events.end.dateTime = new Date(booked_events.end.dateTime);

      if (booked_events.start.dateTime <= event.start.dateTime && booked_events.end.dateTime > event.start.dateTime
        || booked_events.start.dateTime >= event.start.dateTime && booked_events.start.dateTime < event.end.dateTime
        || booked_events.start.dateTime <= event.start.dateTime && booked_events.end.dateTime >= event.end.dateTime
        || booked_events.start.dateTime >= event.start.dateTime && booked_events.end.dateTime <= event.end.dateTime
      ) {
        throw new Error(`Meeting Already Booked at ${data.start} Please choose a different time`);
      }
    }

    return new Promise(function (resolve, reject) {
      fs.readFile('credentials.json', async function (err, content) {
        if (err) return console.log('Error loading client secret file:', err);

        var i = await authorize(JSON.parse(content), event, insert_event);
        console.log(" i is ", i);
        resolve(i);
      });
    });
  }

};


async function authorize(credentials, event, callback) {
  var { client_secret, client_id, redirect_uris } = credentials.web;
  client_id = config_data.client_id;
  client_secret = config_data.client_secret;
  redirect_uris = config_data.redirect_uris;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  return new Promise(function (resolve, reject) {
    fs.readFile(TOKEN_PATH, async function (err, token) {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(await callback(oAuth2Client, event));
    });
  }).catch((err) => console.log("err catch ", err));
}




async function insert_event(auth, event) {
  const calendar = google.calendar({ version: 'v3', auth });
  return await new Promise(async function (resolve, reject) {
    await calendar.events.insert({
      sendNotifications: true,
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, async function (err, event) {
      if (err) {
        throw Error('There was an error contacting the Calendar service: ' + err);
        //   reject();
      }
      // console.log('Event created: %s', event.data);
      resolve(event.data);
    });

  });

}



async function listEvents(auth, start) {
  const calendar = google.calendar({ version: 'v3', auth });
  return await new Promise(async function (resolve, reject) {
    calendar.events.list({
      calendarId: 'primary',
      timeMin: start, // my code 
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      resolve(events);
    });
  });
}
