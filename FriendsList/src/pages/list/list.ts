import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
import { LoginPage } from '../login/login';
import { BackgroundMode } from 'ionic-native';
import { BLE } from 'ionic-native';

BackgroundMode.enable();
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  headers: Headers;
  url: string;
  friends: any[];
  userId: string;
  devices: any[];
  isScanning: boolean

  constructor(public navCtrl: NavController,  public alertCtrl: AlertController, public http: Http, public localStorage:Storage) {
    this.devices = [];
    this.isScanning = false;
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-ID", "AppId1",);
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey",);
    this.localStorage.get('user').then((value) => {
      this.userId = value;
      this.getFriend(null);

    })
    
  
  }


  startScanning() {
    this.devices = [];
    BLE.startScan([]).subscribe(device => {
    this.devices.push(device);
    });

  setTimeout(() => {
    BLE.stopScan().then(() => {
    console.log(JSON.stringify(this.devices))
    this.isScanning = false;
    });
    }, 3000);

  }

  connectToDevice(device) {
    console.log(JSON.stringify(device))
   
  }

  showAddDialog(){
    this.alertCtrl.create({
      title: "Add Tool",
      message: "Add the information for the new tool",
      inputs: [{
        name:  'name',
        placeholder: 'Enter the  Tool Name '
      },{
        name:  'toolbox',
        placeholder: 'Is Tool in ToolBox? '
      },{
        name:  'number',
        placeholder: 'Enter the  Tool Number '
      }],
      buttons:[
        {
          text: "Cancel"
        },{
          text: "Save!",
          handler: data => {
            //post the info to parse server

            this.url = "https://parsewithionic-jasontur.c9users.io/app1/classes/friendslist";

            this.http.post(this.url, { owner: this.userId, name: data.name, number: data.number, toolbox:data.toolbox, image: "http://lorempixel.com/32/32" }, {headers: this.headers}).map(res => res.json()).subscribe(res =>{
                console.log(res);
                this.alertCtrl.create({
                  title: "Success",
                  message: "Tool information Added!",
                  buttons:[{
                    text: "OK!",
                    handler: ()=>{
                      this.getFriend(null);
                    }
                  }]
                }).present()

            }, err => {
                console.log(err);
                this.alertCtrl.create({
                  title: "Error!",
                  message: err.text(),
                  buttons:[{
                    text: "OK!"
                  }]})
                  .present()
            })

          }
        }]})
    .present();
  }

  // import data from server
  getFriend(refresher){

    this.url = 'https://parsewithionic-jasontur.c9users.io/app1/classes/friendslist?where={"owner":"' +this.userId+ '"}';

    this.http.get(this.url, {headers: this.headers}).map(res => res.json()).subscribe(res=>{
      console.log(res);
      this.friends = res.results;

      if(refresher !== null)
        refresher.complete();

    }, err => {
      this.alertCtrl
        .create({ title: "Error!", message: err.text(), buttons:[{ 
          text: 'OK!',
        }]})
        .present();
    })

  }



  editFriend(friend){

    this.alertCtrl.create({
      title: "Edit Tool",
      message: "Edit your tool information here",
      inputs:[{
        name:  'name',
        placeholder: 'Enter the  Tool Name ',
        value:friend.name
      },{
        name:  'toolbox',
        placeholder: 'Is Tool in ToolBox? ',
        value:friend.toolbox
      },{
        name:  'number',
        placeholder: 'Enter the  Tool Number ',
        value:friend.number 
      }],
      buttons:[{
        text: "Cancel"
      },{
        text: "Save",
        handler: data => {
          //perform update on parse server

          this.url ="https://parsewithionic-jasontur.c9users.io/app1/classes/friendslist/" +friend.objectId;

          this.http.put(this.url, {name:data.name, toolbox: data.toolbox, number: data.number}, {headers:this.headers}).map(res => res.json()).subscribe(
            res => {
              console.log(res);
              this.alertCtrl
              .create({ title: "Success", message: "Tools updaded successfully.", buttons:[{
                text: 'OK',
                handler:()=>{
                  this.getFriend(null);
                }
              }]})
              .present();
            },
            err => {
              console.log(err);
              this.alertCtrl
              .create({ title: "Error", message: err.text(), buttons:[{
                text: 'OK'
              }]})
              .present();
            }
          )
        }
      }]
    }).present();



  }

  deleteFriend(friend){
    this.alertCtrl.create({
      title: "Delete Tool",
      message: "Are you sure?",
      buttons: [{
        text: "No"
      },{
        text: "Yes",
        handler: () => {
           //perform delete on parse server here
          
           this.url = "https://parsewithionic-jasontur.c9users.io/app1/classes/friendslist/" + friend.objectId;
           
           this.http.delete(this.url, {headers: this.headers}).map(res => res.json()).subscribe(
             res => {
               console.log(res);
              this.alertCtrl
                .create({ title : "Success", message: "Tool Deleted Successfully.", buttons: [{
                  text: 'OK',
                  handler: ()=>{
                    this.getFriend(null);
                  }
                }]})
                .present();
             },
             err => {
               console.log(err);
                this.alertCtrl
                  .create({ title : "Error", message: err.text(), buttons: [{
                    text: 'OK',
                  }]})
                  .present();
             }
           )
        }
      }]
    }).present();
}


  logout(){
    this.localStorage.remove('user').then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }


}