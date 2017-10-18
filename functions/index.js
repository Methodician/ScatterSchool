// Docs: https://firebase.google.com/docs/functions/get-started
// Use command 'firebase deploy --only functions' from root dir to deploy file changes the cloud

// Important: You must return a Promise when performing asynchronous tasks 
// inside a functions such a writing to the Firebase Realtime Database.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(event => {
        const newCommentKey = event.data.key;
        const newCommentValue = event.data.val();
        console.log('commentValue', newCommentValue);
        makeParentAssociation(newCommentValue.parentKey, newCommentKey)
        makeUserAssociation(newCommentValue.authorKey, newCommentKey);
        makeParentTypeAssociation(newCommentValue.parentType, newCommentValue.parentKey, newCommentKey)
    });

function makeParentAssociation(parentKey, commentKey) {
    return admin.database().ref(`commentData/commentsPerParent/${parentKey}/${commentKey}`).set(true);
}

function makeUserAssociation(authorKey, commentKey) {
    return admin.database().ref(`commentData/commentsPerUser/${authorKey}/${commentKey}`).set(true);
}

function makeParentTypeAssociation(parentType, parentKey, childKey) {
    if (parentType === 'article') return makeCommentsPerArticleAssociation(parentKey, childKey);
    if (parentType === 'comment') return makeRepliesPerCommentAssociation(parentKey, childKey);
}

function makeCommentsPerArticleAssociation(parentKey, commentKey) {
    return admin.database().ref(`commentData/commentsPerArticle/${parentKey}/${commentKey}`).set(true);
}

function makeRepliesPerCommentAssociation(parentKey, commentKey) {
    return admin.database().ref(`commentData/repliesPerComment/${parentKey}/${commentKey}`).set(true);
}
