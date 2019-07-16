import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentTeleponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-telepon',
  templateUrl: 'payment-telepon.html',
})
export class PaymentTeleponPage {
  hidden1 = true;
  hidden2 = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if(localStorage.getItem("MenuTelepon") == "0"){
      this.hidden1 = false;
      this.hidden2 = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentTeleponPage');
  }

}
