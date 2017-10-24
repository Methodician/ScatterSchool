import { AuthGuard } from './guards/auth.guard';
import { MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatCardModule, MatChipsModule, MatSidenavModule, MatTooltipModule, MatTabsModule } from '@angular/material';
import { UploadService } from './services/upload/upload.service';
import { Upload } from './services/upload/upload';
import { CharacterCounterComponent } from './character-counter/character-counter.component';
import { DataCleanupService } from './data-cleanup.service';
import { fbConfig, fbConfigDev } from './config';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './services/user/user.service';
import { ArticleService } from './services/article/article.service';
import { AccountComponent } from './account/account.component';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './home/home.component';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireDatabase as AngularFireDatabase5 } from 'angularfire2/database'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PostArticleComponent } from './post-article/post-article.component';
import { ArticleFormComponent } from './article-form/article-form.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FeaturePreviewComponent } from './feature-preview/feature-preview.component';
import { LatestPreviewComponent } from './latest-preview/latest-preview.component';
import { ArticleSearchPipe } from './pipes/article-search.pipe';
import { ArticleSearchResultsComponent } from './article-search-results/article-search-results.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthorArticlePreviewComponent } from './author-article-preview/author-article-preview.component';
import { FooterComponent } from './footer/footer.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ArticleSearchPreviewComponent } from './article-search-preview/article-search-preview.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TagInputModule } from 'ngx-chips'; // good documentation: https://www.npmjs.com/package/ng2-tag-input
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataCleanupComponent } from './data-cleanup/data-cleanup.component'; // this is needed for ng2-tag-input!
import { TruncateTagsPipe } from './pipes/truncate-tags.pipe';
import { FollowBtnComponent } from './follow-btn/follow-btn.component';
import { FollowedUserComponent } from './followed-user/followed-user.component';
import { FollowerUserComponent } from './follower-user/follower-user.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SuggestionDetailComponent } from './suggestion-detail/suggestion-detail.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';
import { EditSuggestionComponent } from './edit-suggestion/edit-suggestion.component';
import { AddSuggestionComponent } from './add-suggestion/add-suggestion.component';
import { SuggestionPreviewComponent } from './suggestion-preview/suggestion-preview.component';
import { SuggestionService } from './services/suggestion/suggestion.service';
import { VoteService } from './services/vote/vote.service';
import { SuggestionVoteComponent } from './suggestion-vote/suggestion-vote.component';
import { SuggestionSortPipe } from './pipes/suggestion-sort.pipe';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CommentService } from './services/comment/comment.service';
import { CommentListComponent } from './comment-list/comment-list.component';
import { ArticleCoverImageComponent } from './article-cover-image/article-cover-image.component';
import { AddReplyComponent } from './add-reply/add-reply.component';
import { EditCommentComponent } from './edit-comment/edit-comment.component';
import { TimeElapsedPipe } from './pipes/time-elapsed.pipe';
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './services/chat/chat.service';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserPresenceComponent } from './user-presence/user-presence.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ReverseArrayPipe } from './pipes/reverse-array.pipe';
import { ArticleHistoryComponent } from './article-history/article-history.component';
import { ArticleHistoryDetailComponent } from './article-history-detail/article-history-detail.component';
import { UserInteractionComponent } from './user-interaction/user-interaction.component';
import { ChatListComponent } from './chat-list/chat-list.component';



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
    FeaturePreviewComponent,
    LatestPreviewComponent,
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
    ChatListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    //AngularFireModule.initializeApp(fbConfig),
    AngularFireModule.initializeApp(fbConfigDev),
    CollapseModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    CKEditorModule,
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
    MatTabsModule
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
    AngularFireDatabase5
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
