import { FirestoreTestingComponent } from './firestore-testing/firestore-testing.component';
import { ArticleHistoryComponent } from './article-history/article-history.component';
import { AuthGuard } from './guards/auth.guard';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { DataCleanupComponent } from './data-cleanup/data-cleanup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleSearchResultsComponent } from './article-search-results/article-search-results.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { PostArticleComponent } from './post-article/post-article.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestionsComponent } from "app/suggestions/suggestions.component";
import { SuggestionDetailComponent } from "app/suggestion-detail/suggestion-detail.component";
import { AddSuggestionComponent } from "app/add-suggestion/add-suggestion.component";
import { EditSuggestionComponent } from "app/edit-suggestion/edit-suggestion.component";
import { ChatComponent } from "app/chat/chat.component";
import { UserListComponent } from "app/user-list/user-list.component";


const routes: Routes = [
  {
    path: 'test',
    component: FirestoreTestingComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':key',
        component: AccountComponent
      },
      {
        path: '',
        component: AccountComponent
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':key',
        component: ProfileComponent
      },
      {
        path: '',
        component: ProfileComponent
      }
    ]
  },
  {
    path: 'postarticle',
    canActivate: [AuthGuard],
    component: PostArticleComponent
  },
  {
    path: 'editarticle/:key',
    canActivate: [AuthGuard],
    component: EditArticleComponent
  },
  {
    path: 'articledetail/:key',
    component: ArticleDetailComponent
  },
  {
    path: 'articlehistory/:key',
    component: ArticleHistoryComponent
  },
  {
    path: 'articlesearch',
    children: [
      {
        path: ':query',
        component: ArticleSearchResultsComponent
      },
      {
        path: '',
        component: ArticleSearchResultsComponent
      }
    ]
  },
  {
    path: 'suggestions',
    component: SuggestionsComponent
  },
  {
    path: 'postsuggestion',
    canActivate: [AuthGuard],
    component: AddSuggestionComponent
  },
  {
    path: 'suggestion/:key',
    component: SuggestionDetailComponent
  },
  {
    path: 'editsuggestion/:key',
    canActivate: [AuthGuard],
    component: EditSuggestionComponent
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'datacleanup',
    component: DataCleanupComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  //ATTN: this route MUST live at the end of all the routes in this array.
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
