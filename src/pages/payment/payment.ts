import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { SuperTabsController } from '../../ionic2-super-tabs/src';
import { SuperTabs } from "../../ionic2-super-tabs/src/components/super-tabs"; 
import { PaymentCicilanPage } from '../payment-cicilan/payment-cicilan';
import { PaymentListrikPage } from '../payment-listrik/payment-listrik';
import { PaymentPdamPage } from '../payment-pdam/payment-pdam';
import { PaymentTeleponPage } from '../payment-telepon/payment-telepon';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = PaymentListrikPage ;
  page2: any = PaymentPdamPage ;
  page3: any = PaymentTeleponPage ;
  page4: any = PaymentCicilanPage ;
  showIcons: boolean = true;
  showTitles: boolean = true;
  pageTitle: string = 'Full Height';  
  constructor(public navCtrl: NavController, public navParams: NavParams,
             // private superTabsCtrl: SuperTabsController
              ) {
    const type = navParams.get('type');
    switch (type) {
      case 'icons-only':
        this.showTitles = false;
        this.pageTitle += ' - Icons only';
        break;

      case 'titles-only':
        this.showIcons = false;
        this.pageTitle += ' - Titles only';
        break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  ngAfterViewInit() {
    // this.superTabsCtrl.increaseBadge('page1', 10);
    // this.superTabsCtrl.enableTabSwipe('page3', false);
    // this.superTabsCtrl.enableTabsSwipe(false);

    // Test issue #122
    // setTimeout(() => {
    //   this.superTabs.slideTo(4);
    // }, 2000);
  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }
}
