import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {

  user: User = {
    name: "",
    username: "",
    email: "",
    password: "",
  };
  
  confirmPassword: string;
  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-ID", "AppId1",);
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey",);
  }
  

  ionViewDidLoad() {
    console.log('Hello SignupPage page');
  }

  gotoLogin(){
    this.navCtrl.pop();
  }

  signup(){
    if(this.user.password != this.confirmPassword){
      this.alertCtrl.create({
        title: "Error",
        message: "Wrong password. Please try again!",
        buttons: ['Ok']
      }).present();
      return;
    }

    this.url = "https://parsewithionic-jasontur.c9users.io/app1/users";

    this.http.post(this.url, this.user, { headers: this.headers})
    .map(res => res.json())
    .subscribe(res => {
      console.log(res);
      this.alertCtrl
      .create({ title: "Success", message: "Congratulations. Accounts has been created! Please login.",buttons:[{
        text:'Login',
        handler:()=>{
          this.navCtrl.pop();//takes the user back to login
        }
      }]})
      .present();
    },
    err => {
      console.log(err);
      this.alertCtrl
      .create({ title: "Error!", message: err.text(), buttons:[{
        text: 'OK!',
    }]})
    .present();
    })
  }

}
