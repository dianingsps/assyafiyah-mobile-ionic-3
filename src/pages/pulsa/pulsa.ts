import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { SuperTabsController } from '../../ionic2-super-tabs/src';
import { SuperTabs } from "../../ionic2-super-tabs/src/components/super-tabs"; 
import { PulsaHpPage } from '../pulsa-hp/pulsa-hp';
import { PulsaListrikPage } from '../pulsa-listrik/pulsa-listrik';

/**
 * Generated class for the PulsaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pulsa',
  templateUrl: 'pulsa.html',
})
export class PulsaPage {
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = PulsaHpPage ;
  page2: any = PulsaListrikPage ;
  
  showIcons: boolean = true;
  showTitles: boolean = true;
  pageTitle: string = 'Full Height';  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    //private superTabsCtrl: SuperTabsController
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
    console.log('ionViewDidLoad PulsaPage');
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
