//  IMPORTANT: Do not edit index.js or your changes will be lost - use src/index.ts - index.js is transpiled from src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

//-------------v Article View Logging v-------------
export const captureView = functions.firestore.document('articleData/articles/articles/{articleId}/views/{pushId}')
    .onCreate(event => {
        //  Probably not needed since changed from onWrite to onCreate...
        if (event.data.data().viewEnd) {
            console.log('this is a view end event, nothing was incremented.');
            return 'nothing';
        }

        const db = admin.firestore();
        const articleId = event.params.articleId;
        const articleRef = db.doc(`articleData/articles/articles/${articleId}`);
        return db.runTransaction(transaction => {
            return transaction.get(articleRef).then(article => {
                let newCount = article.data().viewCount + 1;
                transaction.update(articleRef, { viewCount: newCount });
            })
                .then(() => {
                    return console.log('view count updated');
                })
                .catch(err => {
                    return console.log('View count could not be updated', err);
                });
        });
    });

export const propagateView = functions.firestore.document('articleData/articles/articles/{articleId}')
    .onUpdate(event => {
        const newViews = event.data.data().viewCount;
        const oldViews = event.data.previous.data().viewCount;
        if (newViews == oldViews)
            return 'nothing';

        const db = admin.firestore();
        const articleId = event.params.articleId;
        const articleVersion = event.data.data().version;
        const historyRef = db.doc(`articleData/articles/articles/${articleId}/history/${articleVersion}`);
        return historyRef.update({ viewCount: newViews })
            .then(success => {
                return console.log('History view count updated');
            })
            .catch(err => {
                return console.log("There probably wasn't any article history to update.", err);
            });
    });

//-------------^ Article View Logging ^-------------

//-------------v CommentAssociations v-------------
export const makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(event => {
        const newCommentKey = event.data.key;
        const newCommentValue = event.data.val();

        commentAssociations({
            rootRef: admin.database().ref(),
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
function commentAssociations({ rootRef, commentKey, commentValue }) {
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
