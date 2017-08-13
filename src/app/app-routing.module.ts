import { DataCleanupComponent } from './data-cleanup/data-cleanup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { FollowUsersComponent } from './follow-users/follow-users.component';
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
    path: 'aboutus',
    component: AboutUsComponent
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
