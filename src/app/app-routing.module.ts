import { AuthorComponent } from './author/author.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleSearchResultsComponent } from './article-search-results/article-search-results.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { PostArticleComponent } from './post-article/post-article.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
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
          path: ':id',
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
      path: 'editarticle/:id',
      component: EditArticleComponent
    },
    {
      path: 'articledetail/:id',
      component: ArticleDetailComponent
    },
    {
      path: 'author',
      children: [
        {
          path: ':id',
          component: AuthorComponent
        },
        {
          path: '',
          component: AuthorComponent
        }
      ]
    },
    {
      path: '',
      component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
