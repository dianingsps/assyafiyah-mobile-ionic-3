import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
//import { SuperTabsController } from '../../ionic2-super-tabs/src';
import  {SuperTabs} from "../../ionic2-super-tabs/src/components/super-tabs"; 
import { AkunCeksaldoPage } from '../akun-ceksaldo/akun-ceksaldo';
import { AkunMutasiPage } from '../akun-mutasi/akun-mutasi';
import { TransferPage } from '../transfer/transfer';
/**
 * Generated class for the AkunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() 
@Component({
  selector: 'page-akun',
  templateUrl: 'akun.html',
})
export class AkunPage { 
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = AkunCeksaldoPage ;
  page2: any = AkunMutasiPage ;
  page3: any = TransferPage ;
  
  showIcons: boolean = true;
  showTitles: boolean = true;
  pageTitle: string = 'Full Height';

  constructor(public navCtrl: NavController, 
              public platform: Platform,
              public toastCtrl:ToastController,
              public navParams: NavParams) {
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
    console.log('ionViewDidLoad AkunPage');
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
