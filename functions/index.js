// Docs: https://firebase.google.com/docs/functions/get-started
// Use command 'firebase deploy --only functions' from root dir to deploy file changes the cloud

// Important: You must return a Promise when performing asynchronous tasks 
// inside a functions such a writing to the Firebase Realtime Database.

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
firebase.initializeApp(functions.config().firebase);

//-------------v CommentAssociations v-------------
exports.makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(event => {
        const newCommentKey = event.data.key;
        const newCommentValue = event.data.val();

        commentAssociations({
            rootRef: firebase.database().ref(),
            commentKey: newCommentKey,
            commentValue: newCommentValue
        }).then(_ => {
            console.log('Success: commentAssociations.');
        }).catch(err => {
            console.error('Fail: commentAssociations.', err)
        });
    });
    
// This is an atomic function. As a guide I used
// this video: https://www.youtube.com/watch?v=i1n9Kw3AORw starting at 5:35
function commentAssociations({rootRef, commentKey, commentValue}) {
    // Create empty update object
    let updateObj = {}
    //  Add to updateObj: The path and value you would like to update
        updateObj[makeParentAssociation(commentValue.parentKey, commentKey)] = true;
        updateObj[makeUserAssociation(commentValue.parentKey, commentKey)] = true;
        updateObj[makeParentTypeAssociation(commentValue.parentType, commentValue.parentKey, commentKey)] = true;
    // Updates the database, return the promise 
    return rootRef.update(updateObj)
}

function makeParentAssociation(parentKey, commentKey) {
    return `commentData/commentsPerParent/${parentKey}/${commentKey}`;
}

function makeUserAssociation(authorKey, commentKey) {
    return `commentData/commentsPerUser/${authorKey}/${commentKey}`;
}

function makeParentTypeAssociation(parentType, parentKey, childKey) {
    if (parentType === 'article') return makeCommentsPerArticleAssociation(parentKey, childKey);
    if (parentType === 'comment') return makeRepliesPerCommentAssociation(parentKey, childKey);
}

function makeCommentsPerArticleAssociation(parentKey, commentKey) {
    return `commentData/commentsPerArticle/${parentKey}/${commentKey}`;
}

function makeRepliesPerCommentAssociation(parentKey, commentKey) {
    return `commentData/repliesPerComment/${parentKey}/${commentKey}`;
}
//-------------^ CommentAssociations ^-------------
//-------------v ChatAssociations v-------------
exports.makeChatAssociations = functions.database.ref('chatDataTest/chats/{pushId}')
    .onWrite(event => {
        const newChatKey = event.data.key;
        const newChatValue = event.data.val();
        // console.log('key/value', newChatKey, newChatValue);
        chatAssociations({
            rootRef: firebase.database().ref(),
            chatKey: newChatKey
        }).then(_ => {
            console.log('Success: chatAssociations.');
        }).catch(err => {
            console.error('Fail: chatAssociations.', err)
        });
    });

    function chatAssociations({rootRef, chatKey}) {
        const chatMembersRef = rootRef.child(`chatDataTest/chats/${chatKey}/members`);
        return chatMembersRef.once('value').then(members => {
            let updateObj = {};
            members.forEach(member => {
                    console.log('member', member);
                // updateObj[`chatDataTest/chats/${chatKey}/members/${member.key}`] = {name: member.name, messagesSeenCount: 0};
                // updateObj[`chatDataTest/chatsPerMember/${member.key}/${chatKey}`] = true;
                // updateObj[`chatDataTest/membersPerChat/${chatKey}/${member.key}`] = { name: member.name};
            });
        });

    }
//-------------^ ChatAssociations ^-------------

// for (let user of users) {
//     let displayName = user.alias ? user.alias : user.fName;
//     this.db.object(`chatDataTest/chats/${chatKey}/members/${user.$key}`).update({ name: displayName, messagesSeenCount: 0 });
//     this.db.object(`chatDataTest/chatsPerMember/${user.$key}/${chatKey}`).set(true);
//     this.db.object(`chatDataTest/membersPerChat/${chatKey}/${user.$key}`).update({ name: displayName });
// }
