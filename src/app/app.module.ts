import { AuthGuard } from 'app/shared/routing/guards/auth.guard';
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatChipsModule,
  MatSidenavModule,
  MatTooltipModule,
  MatTabsModule
} from '@angular/material';
import { UploadService } from 'app/shared/services/upload/upload.service';
import { Upload } from 'app/shared/class/upload';
import { CharacterCounterComponent } from 'app/components/shared/character-counter/character-counter.component';
import { DataCleanupService } from './data-cleanup.service';
import { fbConfig, fbConfigDev } from './config';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from 'app/shared/services/user/user.service';
import { ArticleService } from 'app/shared/services/article/article.service';
import { AccountComponent } from 'app/components/account/account/account.component';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { HomeComponent } from 'app/components/general/home/home.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'app/components/account/register/register.component';
import { LoginComponent } from 'app/components/account/login/login.component';
import { PostArticleComponent } from 'app/components/articles/post-article/post-article.component';
import { ArticleFormComponent } from 'app/components/articles/article-form/article-form.component';
// import { CKEditorModule } from 'ng2-ckeditor';
import { EditArticleComponent } from 'app/components/articles/edit-article/edit-article.component';
import { TopNavComponent } from 'app/components/shared/top-nav/top-nav.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ArticleSearchPipe } from 'app/shared/pipes/article-search.pipe';
import { ArticleSearchResultsComponent } from 'app/components/general/article-search-results/article-search-results.component';
import { ArticleDetailComponent } from 'app/components/articles/article-detail/article-detail.component';
import { ProfileComponent } from 'app/components/account/profile/profile.component';
import { PageNotFoundComponent } from 'app/components/general/page-not-found/page-not-found.component';
import { AuthorArticlePreviewComponent } from 'app/components/previews/author-article-preview/author-article-preview.component';
import { FooterComponent } from 'app/components/shared/footer/footer.component';
import { TruncatePipe } from 'app/shared/pipes/truncate.pipe';
import { ArticleSearchPreviewComponent } from 'app/components/previews/article-search-preview/article-search-preview.component';
import { AboutUsComponent } from 'app/components/general/about-us/about-us.component';
import { TagInputModule } from 'ngx-chips'; // good documentation: https://www.npmjs.com/package/ng2-tag-input
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataCleanupComponent } from 'app/components/general/data-cleanup/data-cleanup.component'; // this is needed for ng2-tag-input!
import { TruncateTagsPipe } from 'app/shared/pipes/truncate-tags.pipe';
import { FollowBtnComponent } from 'app/components/shared/follow-btn/follow-btn.component';
import { FollowedUserComponent } from 'app/components/account/followed-user/followed-user.component';
import { FollowerUserComponent } from 'app/components/account/follower-user/follower-user.component';
import { UploadFormComponent } from 'app/components/shared/upload-form/upload-form.component';
import { SuggestionsComponent } from 'app/components/suggestions/suggestions/suggestions.component';
import { SuggestionDetailComponent } from 'app/components/suggestions/suggestion-detail/suggestion-detail.component';
import { SuggestionFormComponent } from 'app/components/suggestions/suggestion-form/suggestion-form.component';
import { EditSuggestionComponent } from 'app/components/suggestions/edit-suggestion/edit-suggestion.component';
import { AddSuggestionComponent } from 'app/components/suggestions/add-suggestion/add-suggestion.component';
import { SuggestionPreviewComponent } from 'app/components/suggestions/suggestion-preview/suggestion-preview.component';
import { SuggestionService } from 'app/shared/services/suggestion/suggestion.service';
import { VoteService } from 'app/shared/services/vote/vote.service';
import { SuggestionVoteComponent } from 'app/components/suggestions/suggestion-vote/suggestion-vote.component';
import { SuggestionSortPipe } from 'app/shared/pipes/suggestion-sort.pipe';
import { ProfileImageComponent } from 'app/components/shared/profile-image/profile-image.component';
import { CommentComponent } from 'app/components/comments/comment/comment.component';
import { CommentFormComponent } from 'app/components/comments/comment-form/comment-form.component';
import { AddCommentComponent } from 'app/components/comments/add-comment/add-comment.component';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { CommentListComponent } from 'app/components/comments/comment-list/comment-list.component';
import { ArticleCoverImageComponent } from 'app/components/articles/article-cover-image/article-cover-image.component';
import { AddReplyComponent } from 'app/components/comments/add-reply/add-reply.component';
import { EditCommentComponent } from 'app/components/comments/edit-comment/edit-comment.component';
import { TimeElapsedPipe } from 'app/shared/pipes/time-elapsed.pipe';
import { ChatComponent } from 'app/components/user-interaction/chat/chat.component';
import { ChatService } from 'app/shared/services/chat/chat.service';
import { ChatFormComponent } from 'app/components/user-interaction/chat-form/chat-form.component';
import { UserListComponent } from 'app/components/user-interaction/user-list/user-list.component';
import { UserPresenceComponent } from 'app/components/user-interaction/user-presence/user-presence.component';
import { SafeHtmlPipe } from 'app/shared/pipes/safe-html.pipe';
import { SafeUrlPipe } from 'app/shared/pipes/safe-url.pipe';
import { ReverseArrayPipe } from 'app/shared/pipes/reverse-array.pipe';
import { ArticleHistoryComponent } from 'app/components/articles/article-history/article-history.component';
import { ArticleHistoryDetailComponent } from 'app/components/articles/article-history-detail/article-history-detail.component';
import { UserInteractionComponent } from 'app/components/user-interaction/user-interaction/user-interaction.component';
import { ChatListComponent } from 'app/components/user-interaction/chat-list/chat-list.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationService } from './shared/services/notification/notification.service';

import { AngularFireStorageModule } from 'angularfire2/storage';
import { ArticlePreviewCardComponent } from './components/previews/article-preview-card/article-preview-card.component';
import { ArticlePreviewListComponent } from './components/previews/article-preview-list/article-preview-list.component';
import { ArticleRelatedComponent } from './components/articles/article-related/article-related.component';
import { ArticleRelatedPipePipe } from './shared/pipes/article-related-pipe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AccountComponent,
    PostArticleComponent,
    ArticleFormComponent,
    EditArticleComponent,
    TopNavComponent,
    ArticleSearchPipe,
    ArticleSearchResultsComponent,
    ArticleDetailComponent,
    ProfileComponent,
    PageNotFoundComponent,
    AuthorArticlePreviewComponent,
    FooterComponent,
    TruncatePipe,
    ArticleSearchPreviewComponent,
    AboutUsComponent,
    DataCleanupComponent,
    TruncateTagsPipe,
    FollowBtnComponent,
    FollowedUserComponent,
    FollowerUserComponent,
    SuggestionsComponent,
    SuggestionDetailComponent,
    SuggestionFormComponent,
    EditSuggestionComponent,
    AddSuggestionComponent,
    SuggestionPreviewComponent,
    SuggestionVoteComponent,
    SuggestionSortPipe,
    CharacterCounterComponent,
    ProfileImageComponent,
    CommentComponent,
    CommentFormComponent,
    AddCommentComponent,
    CommentListComponent,
    UploadFormComponent,
    AddReplyComponent,
    EditCommentComponent,
    TimeElapsedPipe,
    UploadFormComponent,
    ArticleCoverImageComponent,
    ChatComponent,
    ChatFormComponent,
    UserListComponent,
    UserPresenceComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    ReverseArrayPipe,
    ArticleHistoryComponent,
    ArticleHistoryDetailComponent,
    UserInteractionComponent,
    ChatListComponent,
    NotificationsComponent,
    ArticlePreviewCardComponent,
    ArticlePreviewListComponent,
    ArticleRelatedComponent,
    ArticleRelatedPipePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // AngularFireModule.initializeApp(fbConfig),
    AngularFireModule.initializeApp(fbConfigDev),
    AngularFirestoreModule,
    CollapseModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    // CKEditorModule,
    TagInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    MatTabsModule,
    AngularFireStorageModule
    // for storage

  ],
  providers: [
    AngularFireDatabase,
    AuthService,
    UserService,
    ArticleService,
    DataCleanupService,
    UploadService,
    SuggestionService,
    VoteService,
    CommentService,
    ChatService,
    AuthGuard,
    ArticleSearchPipe,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
