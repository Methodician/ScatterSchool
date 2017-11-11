//  This could be broken out into a more modular approach
import { FirestoreTestingComponent } from './firestore-testing/firestore-testing.component';
import { ArticleHistoryComponent } from 'app/components/articles/article-history/article-history.component';
import { AuthGuard } from 'app/shared/routing/guards/auth.guard';
import { UploadFormComponent } from 'app/components/shared/upload-form/upload-form.component';
import { DataCleanupComponent } from 'app/components/general/data-cleanup/data-cleanup.component';
import { PageNotFoundComponent } from 'app/components/general/page-not-found/page-not-found.component';
import { ProfileComponent } from 'app/components/account/profile/profile.component';
import { ArticleDetailComponent } from 'app/components/articles/article-detail/article-detail.component';
import { ArticleSearchResultsComponent } from 'app/components/general/article-search-results/article-search-results.component';
import { EditArticleComponent } from 'app/components/articles/edit-article/edit-article.component';
import { PostArticleComponent } from 'app/components/articles/post-article/post-article.component';
import { AccountComponent } from 'app/components/account/account/account.component';
import { LoginComponent } from 'app/components/account/login/login.component';
import { RegisterComponent } from 'app/components/account/register/register.component';
import { AboutUsComponent } from 'app/components/general/about-us/about-us.component';
import { HomeComponent } from 'app/components/general/home/home.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestionsComponent } from "app/components/suggestions/suggestions/suggestions.component";
import { SuggestionDetailComponent } from "app/components/suggestions/suggestion-detail/suggestion-detail.component";
import { AddSuggestionComponent } from "app/components/suggestions/add-suggestion/add-suggestion.component";
import { EditSuggestionComponent } from "app/components/suggestions/edit-suggestion/edit-suggestion.component";
import { ChatComponent } from "app/components/user-interaction/chat/chat.component";
import { UserListComponent } from "app/components/user-interaction/user-list/user-list.component";


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
