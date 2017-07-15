const functions = require('firebase-functions');
//import functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    admin.database().ref('/messages').push({ original: original }).then(snapshot => {
        res.redirect(303, snapshot.ref);
    });
});

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    //  Listens for messages added to /messages/:pushId/original
    .onWrite(event => {
        const original = event.data.val();
        console.log('Uppercasing', event.params.pushId, original);
        const uppercase = original.toUpperCase();
        if (uppercase == original)
            return null;
        else
            return event.data.ref.parent.child('uppercase').set(uppercase);
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
