import { UserService } from './services/user/user.service';
import { ArticleService } from './services/article/article.service';
//import * as firebase from 'firebase';
import { AccountComponent } from './account/account.component';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './home/home.component';
import { AngularFireDatabase } from 'angularfire2/database';
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
import { CkTestComponent } from './ck-test/ck-test.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { EditArticleComponent } from './edit-article/edit-article.component';


const fbConfig = {
  apiKey: "AIzaSyCHmMp6nCKnQH-uex9_XsuihiT0V7FcbpA",
  authDomain: "scatterschool-77900.firebaseapp.com",
  databaseURL: "https://scatterschool-77900.firebaseio.com",
  projectId: "scatterschool-77900",
  storageBucket: "scatterschool-77900.appspot.com",
  messagingSenderId: "946494517942"
};

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
    path: ':mystring',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AccountComponent,
    PostArticleComponent,
    ArticleFormComponent,
    CkTestComponent,
    EditArticleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(fbConfig),
    RouterModule.forRoot(routes),
    AngularFireAuthModule,
    CKEditorModule
  ],
  providers: [
    AngularFireDatabase,
    AuthService,
    UserService,
    ArticleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
