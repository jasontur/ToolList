import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

  user: User = {
    username: "",
    password: ""
  };

  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http, public localStorage: Storage) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "AppId1");
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey",);
  }

  goToSignUp(){
    this.navCtrl.push(SignupPage);
  }

  login(){
    if(!(this.user.username && this.user.password)){
      this.alertCtrl
        .create({ title : "Error", message: "Check username or password. Please retry.", buttons: ['OK']})
        .present();
      return;
    }

    this.url = "https://parsewithionic-jasontur.c9users.io/app1/login?username="+this.user.username+ "&password="+this.user.password;

    this.http.get(this.url, {headers: this.headers}).subscribe(res => {
      console.log(res);
      //Navigate the user to the main app page
      
      this.localStorage.set('user', res.json().objectId).then(()=>{
        this.navCtrl.setRoot(ListPage);
      })
      
    }, err => {
      console.log(err);
      this.alertCtrl
        .create({ title : "Error", message: err.text(), buttons: [{
          text: 'OK',
        }]})
        .present();

    })

  }

}