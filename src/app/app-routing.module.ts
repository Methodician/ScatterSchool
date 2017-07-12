import { EditArticleComponent } from './edit-article/edit-article.component';
import { PostArticleComponent } from './post-article/post-article.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: 'home',
        children: [
            {
                path: ':mystring',
                component: HomeComponent
            },
            {
                path: '',
                component: HomeComponent
            }
        ]
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
        component: AccountComponent
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