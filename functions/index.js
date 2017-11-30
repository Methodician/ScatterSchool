"use strict";
//  IMPORTANT: Do not edit index.js or your changes will be lost - use src/index.ts - index.js is transpiled from src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
// const functions = require('firebase-functions');
var admin = require("firebase-admin");
// const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//-------------v Article View Logging v-------------
//  What a mess! This was a lot harder than I expected
//  I spent most of the time trying to use transactions but that didn't seem to work...
//  I think there is a better way, possibly batch updates or transactions.
exports.captureView = functions.firestore.document('articleData/articles/articles/{articleId}/views/{pushId}')
    .onWrite(function (event) {
    if (event.data.data().viewEnd) {
        console.log('this is a view end event, nothing was incremented.');
        return 'nothing';
    }
    var db = admin.firestore();
    var data = event.data.data();
    var articleId = event.params.articleId;
    var articleVersion = data.articleVersion;
    var articleRef = db.doc("articleData/articles/articles/" + articleId);
    var articleHistoryRef = db.doc("articleData/articles/articles/" + articleId + "/history/" + articleVersion);
    return articleRef.get().then(function (article) {
        var newCount = article.data().viewCount + 1;
        return articleRef.update({ viewCount: newCount })
            .then(function (success) {
            console.log('Article view count was updated from ' + article.data().viewCount + ' to ' + newCount);
            articleHistoryRef.get()
                .then(function (hist) {
                if (hist) {
                    articleHistoryRef.update({ viewCount: newCount })
                        .then(function (success) {
                        console.log('History view count was updated from ' + article.data().viewCount + ' to ' + newCount);
                        return newCount;
                    })
                        .catch(function (err) {
                        console.log("There article probably has no history", err);
                        return newCount;
                    });
                }
            })
                .catch(function (err) {
                console.log('I think this will only execute if no history', err);
                return newCount;
            });
        })
            .catch(function (err) {
            console.log('I think this will execute if there is a real issue with the main article', err);
            return newCount;
        });
    });
});
//  I CAN'T FOR THE LIFE OF ME GET THE TRANSACTION TO ACTUALLY EXECUTE UPDATES EVEN THOUGH THERE ARE NO ERRORS
// return db.runTransaction(transaction => {
//     return transaction.get(articleRef).then(article => {
//         let newCount = article.data().viewCount + 1;
//         transaction.get(articleHistoryRef).then(hist => {
//             if (hist.exists) {
//                 transaction.update(articleRef, { viewCount: newCount });
//                 transaction.update(articleHistoryRef, { viewCount: newCount });
//                 return console.log('updated history - ', hist.data());
//             }
//             transaction.update(articleRef, { viewCount: newCount });
//             return console.log('only updated article - ', article.data());
//         })
//             .catch(err => console.log(err));
//     })
//         .then(() => {
//             return console.log('view count updated');
//         })
//         .catch(err => {
//             return console.log('view count could not be updated', err);
//         });
// });
// db.runTransaction(transaction => {
//     return transaction.get(articleRef).then(article => {
//         console.log('article:', article.data());
//         let newCount = article.data().viewCount + 1;
//         // transaction.update(articleRef, { viewCount: newCount });
//         transaction.get(articleHistoryRef).then(hist => {
//             if (hist.exists) {
//                 transaction.update(articleRef, { viewCount: newCount });
//                 return transaction.update(articleHistoryRef, { viewCount: newCount });
//             }
//             else
//                 return transaction.update(articleRef, { viewCount: newCount });
//         })
//     })
//  Turns out not neede with current usage.
//  Decided against logging viewEnds separately, opting to just store a viewStart and viewEnd timestamp
// export const captureUnView = functions.firestore.document('articleData/articles/articles/{articleId}/unViews/{pushId}')
//     .onWrite(event => {
//         //console.log(event);
//         //return console.log('Article unView captured');
//     });
//-------------^ Article View Logging ^-------------
//-------------v CommentAssociations v-------------
exports.makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(function (event) {
    var newCommentKey = event.data.key;
    var newCommentValue = event.data.val();
    commentAssociations({
        rootRef: admin.database().ref(),
        commentKey: newCommentKey,
        commentValue: newCommentValue
    }).then(function (_) {
        console.log('Success: commentAssociations.');
    }).catch(function (err) {
        console.error('Fail: commentAssociations.', err);
    });
});
// This is an atomic function. As a guide I used
// this video: https://www.youtube.com/watch?v=i1n9Kw3AORw starting at 5:35
function commentAssociations(_a) {
    var rootRef = _a.rootRef, commentKey = _a.commentKey, commentValue = _a.commentValue;
    // Create empty update object
    var updateObj = {};
    //  Add to updateObj: The path and value you would like to update
    updateObj[makeParentAssociation(commentValue.parentKey, commentKey)] = true;
    updateObj[makeUserAssociation(commentValue.parentKey, commentKey)] = true;
    updateObj[makeParentTypeAssociation(commentValue.parentType, commentValue.parentKey, commentKey)] = true;
    // Updates the database, return the promise 
    return rootRef.update(updateObj);
}
function makeParentAssociation(parentKey, commentKey) {
    return "commentData/commentsPerParent/" + parentKey + "/" + commentKey;
}
function makeUserAssociation(authorKey, commentKey) {
    return "commentData/commentsPerUser/" + authorKey + "/" + commentKey;
}
function makeParentTypeAssociation(parentType, parentKey, childKey) {
    if (parentType === 'article')
        return makeCommentsPerArticleAssociation(parentKey, childKey);
    if (parentType === 'comment')
        return makeRepliesPerCommentAssociation(parentKey, childKey);
}
function makeCommentsPerArticleAssociation(parentKey, commentKey) {
    return "commentData/commentsPerArticle/" + parentKey + "/" + commentKey;
}
function makeRepliesPerCommentAssociation(parentKey, commentKey) {
    return "commentData/repliesPerComment/" + parentKey + "/" + commentKey;
}
//-------------^ CommentAssociations ^-------------
//# sourceMappingURL=index.js.map