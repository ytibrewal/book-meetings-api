# book-meetings-api

Booking calander Events / Meetings of 30mins at a given time with a guest user and sending them calander meeting notification mail. 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    npm install
    ```

3. Start your app

    ```
    npm start
    ```
4. At first the api will initiate Google OAuth for getting permissions for add/edit/delete events from your google calander

    1. Open the link mentioned in the terminal 
    2. Login to your google account and allow permissions to Quickstart 
    3. You will be directed to the localhost, notice there is a code in the url /   querystring, we need to copy the code and paste on terminal.
    4. After successfull autharization it will display "Token stored to token.json"


## Examples

1. Creating an event / meeting 
    A mail will be sent to all the participants by google calander

    ```
    POST localhost:3030/event
    {
        "name": "John Doe",
        "start": "2022-05-27T13:33:32.000Z",
        "email": "test@gmail.com"
    }
    output -->
    {
        "kind": "calendar#event",
        "etag": "\"3235468807810000\"",
        "id": "qilc5irv2jvdq3u8qll399ulmo",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=xxxxxxxxxxxxxxxxxxxxxx",
        "created": "2020-04-06T18:40:03.000Z",
        "updated": "2020-04-06T18:40:03.905Z",
        "summary": "Meeting with John Doe",
        "creator": {
            "email": "ytibrewal.yash@gmail.com",
            "self": true
        },
        "organizer": {
            "email": "ytibrewal.yash@gmail.com",
            "self": true
        },
        "start": {
            "dateTime": "2020-05-27T19:03:32+05:30",
            "timeZone": "Asia/Kolkata"
        },
        "end": {
            "dateTime": "2020-05-27T19:33:32+05:30",
            "timeZone": "Asia/Kolkata"
        },
        "iCalUID": "qilc5irv2jvdq3u8qll399ulmo@google.com",
        "sequence": 0,
        "attendees": [
            {
                "email": "ytibrewal.yash@gmail.com",
                "organizer": true,
                "self": true,
                "responseStatus": "needsAction"
            },
            {
                "email": "test@gmail.com",
                "responseStatus": "needsAction"
            }
        ],
        "reminders": {
            "useDefault": true
        },
        "eventType": "default"
    }
    ```

    
2. Getting upcomming 10 calander events 

    ```
    GET localhost:3030/event
    
    ```
