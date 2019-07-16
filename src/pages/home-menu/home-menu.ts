import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Func } from '../../service/func';
import { AkunMutasiPage } from '../akun-mutasi/akun-mutasi';
import { AkunPage } from '../akun/akun';
import { SettingPage } from '../setting/setting';
import { RiwayatPage } from '../riwayat/riwayat';
import { BpjsPage } from '../bpjs/bpjs';
import { PaymentPage } from '../payment/payment';
import { PulsaPage } from '../pulsa/pulsa';

/**
 * Generated class for the HomeMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-menu',
  templateUrl: 'home-menu.html',
})
export class HomeMenuPage {

  ucapin: any;
  data = [];
  dataBerita = [];
  gambar: any;
  berita = 0;
  brosur = 0;
  nama: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public statusbar: StatusBar,
              public platform: Platform,
              public func:Func,) 
  {
    this.ucapin = this.func.getSuasana();
    this.nama = localStorage.getItem("NamaNasabah") ;
    this.getListBrosur();
    this.getListBerita();
    this.getListBrosur();
    this.getListBerita();
    this.getListBrosur();
    this.getListBerita();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuPage');
  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#36884D","gelap");
  }

  openRekening(){
    this.navCtrl.push(AkunPage);
  }

  openPrabayar(){
    this.navCtrl.push(PulsaPage);
  }

  openPascabayar(){
    this.navCtrl.push(PaymentPage);
  }

  openBPJS(){
    this.navCtrl.push(BpjsPage);
  }

  openRiwayat(){
    this.navCtrl.push(RiwayatPage);
  }

  openSetting(){
    this.navCtrl.push(SettingPage);
  }

  getListBrosur(){
    this.data.push({
      Kode:"01",
      Brosur:"Coba",
      Deskripsi:"Coba teks brosur",
      DateTimeAwal:"19/08/2019",
      DateTimeAkhir:"19/08/2019",
      Syarat:"",
      Url: ["assets/img.jpg"]
    });
  }

  getListBerita(){
    this.dataBerita.push({
      Kode: "01",
      Berita: "Coba",
      Deskripsi: "Coba berita 1",
      UserName: "aku",
      DateTime: "16/08/2001",
      Url: ["assets/img.jpg"]
    });
  }
}