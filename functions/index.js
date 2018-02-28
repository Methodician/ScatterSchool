"use strict";
//  IMPORTANT: Do not edit index.js or your changes will be lost - use src/index.ts - index.js is transpiled from src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
//-------------v Article View Logging v-------------
exports.captureView = functions.firestore.document('articleData/articles/articles/{articleId}/views/{pushId}')
    .onCreate(function (event) {
    //  Probably not needed since changed from onWrite to onCreate...
    if (event.data.data().viewEnd) {
        console.log('this is a view end event, nothing was incremented.');
        return 'nothing';
    }
    var db = admin.firestore();
    var articleId = event.params.articleId;
    var articleRef = db.doc("articleData/articles/articles/" + articleId);
    return db.runTransaction(function (transaction) {
        return transaction.get(articleRef).then(function (article) {
            var newCount = article.data().viewCount + 1;
            transaction.update(articleRef, { viewCount: newCount });
        })
            .then(function () {
            return console.log('view count updated');
        })
            .catch(function (err) {
            return console.log('View count could not be updated', err);
        });
    });
});
exports.propagateView = functions.firestore.document('articleData/articles/articles/{articleId}')
    .onUpdate(function (event) {
    var newViews = event.data.data().viewCount;
    var oldViews = event.data.previous.data().viewCount;
    if (newViews == oldViews)
        return 'nothing';
    var db = admin.firestore();
    var articleId = event.params.articleId;
    var articleVersion = event.data.data().version;
    var historyRef = db.doc("articleData/articles/articles/" + articleId + "/history/" + articleVersion);
    return historyRef.update({ viewCount: newViews })
        .then(function (success) {
        return console.log('History view count updated');
    })
        .catch(function (err) {
        return console.log("There probably wasn't any article history to update.", err);
    });
});
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