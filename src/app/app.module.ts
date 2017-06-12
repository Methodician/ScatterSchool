import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

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
    component: HomeComponent
  },
  {
    path: 'home/:mystring',
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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(fbConfig),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AngularFireDatabase,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
