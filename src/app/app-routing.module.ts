import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
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
import { AllArticlesComponent } from "app/all-articles/all-articles.component";


const routes: Routes = [
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
    component: PostArticleComponent
  },
  {
    path: 'editarticle/:key',
    component: EditArticleComponent
  },
  {
    path: 'articledetail/:key',
    component: ArticleDetailComponent
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
    component: AddSuggestionComponent
  },
  {
    path: 'suggestion/:key',
    component: SuggestionDetailComponent
  },
  {
    path: 'editsuggestion/:key',
    component: EditSuggestionComponent
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'datacleanup',
    component: DataCleanupComponent
  },
  {
    path: 'allarticles',
    component: AllArticlesComponent
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
