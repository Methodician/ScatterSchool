// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// You must return a Promise when performing asynchronous tasks inside a
// Functions such a writing to the Firebase Realtime Database.
const functions = require('firebase-functions');

exports.makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(event => {
        const newCommentKey = event.data.key;
        const newCommentVlaue = event.data.val();
        // makeParentAssociation
        functions.database.ref(`commentData/commentsPerParent/${ newComment.parentKey }/${ newCommentKey }`).set(true);

        // makeUserAssociation
        // makeParentTypeAssociation
        // makeCommentsPerArticleAssociation
    });

