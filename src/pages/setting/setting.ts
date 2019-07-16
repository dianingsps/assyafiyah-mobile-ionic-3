import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,List,AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';
import { SettingGantiPinPage } from '../setting-ganti-pin/setting-ganti-pin';
//import { AppVersion } from '@ionic-native/app-version';
import { SettingUbahRekeningPage } from '../setting-ubah-rekening/setting-ubah-rekening';
import { SettingAmbilProdukPage } from '../setting-ambil-produk/setting-ambil-produk';
import { SettingGantiPassPage } from '../setting-ganti-pass/setting-ganti-pass';
import { SettingRiwayatPage } from '../setting-riwayat/setting-riwayat';
import { Config } from '../../service/config' ;
import { RequestOptions, Http,Headers } from '@angular/http';
import { Func } from '../../service/func';
import { SettingCallCenterPage } from '../setting-call-center/setting-call-center';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  loading: Loading;
  @ViewChild(List) list: List; 
  constructor(public navCtrl: NavController, public navParams: NavParams,public config: Config,//private appVersion: AppVersion,
              public alertCtrl:AlertController,public http: Http,
              public func:Func,public toastCtrl:ToastController,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  getCS(){
    this.navCtrl.push(SettingCallCenterPage);
  }

  gantipin(){
    this.navCtrl.push(SettingGantiPinPage) ;
  }
 
  getversion(){
    let vaInfo = this.config.cNamaApp + "<br>" ;
    vaInfo += "Versi aplikasi: " + this.config.cVersiApp + "<br>" ; 
    this.showAlert("Info Aplikasi :",vaInfo.toString()) ;  
  }
 
  ubahrekeningutama(){
    this.navCtrl.push(SettingUbahRekeningPage) ; 
  }     

  ambilproduk(){
    this.navCtrl.push(SettingAmbilProdukPage) ;
  } 

  gantipass(){
    this.navCtrl.push(SettingGantiPassPage) ;
  } 

  riwayat(){
    this.navCtrl.push(SettingRiwayatPage) ;
  }

  downloadrekening(){
    this.showLoading();
    
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');
 
    let cSIMSerial = localStorage.getItem("SIMSerial") ; 
    
    var cBody = { 
                  TRX: "13",  
                  DE003: "131000",
                  DE004: "000000000000",
                  DE012: this.func.getTime(), 
                  DE013: this.func.getDate(),
                  DE037: "000000000000",
                  DE039: "00", 
                  DE044: "0",
                  DE048: "", 
                  DE052: "00000000000000000000000000000000" + "00000000000000000000000000000000",
                  DE061: cSIMSerial,
                  DE102: "", 
                  DE103: ""
                }  
    var cRequest = {
                  MTI: "002",
                  MSG: cBody
                  } 
    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : "+data);        
    this.http.post(this.config.cURL,data,options)  
      .map(res => res.json())     
      .subscribe(res => {           
          this.stopLoading();  
          if(res['DE039']== "00"){
            localStorage.setItem("RekeningNasabah",res['DE048']);
            this.showToast("Berhasil mengambil rekening","bottom");
          }else{   
            this.showAlert(this.func.getRC(res['DE039']),"Pesan :")
          }        
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
    }) ; 

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Mengambil Rekening...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  } 

}
