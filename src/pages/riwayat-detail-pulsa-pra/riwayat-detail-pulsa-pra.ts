import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Func } from '../../service/func' ;
import { Http } from '@angular/http';
import { Config } from '../../service/config' ;
import { App, ViewController } from 'ionic-angular';

/**
 * Generated class for the RiwayatDetailPulsaPraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-pulsa-pra',
  templateUrl: 'riwayat-detail-pulsa-pra.html',
})
export class RiwayatDetailPulsaPraPage {
  cTitle    = '';
  dTgl      = '';
  cRekening = '';
  cNomor    = '';
  cNominal  = '';
  cStatus   = '';
  nHarga    = '';
  cSN       = '';
  cKode     = '';
  lHide     = false;
  cData     = '';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public func:Func,
    public http: Http,
    public config: Config,
    public viewCtrl: ViewController,
    public appCtrl: App) {
    this.cData = this.navParams.get("getItem"); 
    console.log('getData->',this.cData);
    if(this.cData != null){
      this.cTitle     = this.cData["Jenis"] ;
      this.cRekening  = this.cData["Rekening"] ;
      this.dTgl       = this.cData["Tgl"] ;
      this.cNomor     = this.cData["NoHP"] ;
      this.cNominal   = this.cData["Nominal"] ;
      this.nHarga     = this.cData["Harga"] ;
      this.cSN        = this.cData["SN"] ;
      this.cStatus    = this.cData["Status"] ;
      this.cKode      = this.cData["Kode"] ;
    }else{
      this.cTitle     = this.navParams.get("Jenis") ;
      this.cRekening  = this.navParams.get("Rekening") ;
      this.dTgl       = this.navParams.get("Tgl") ;
      this.cNomor     = this.navParams.get("NoHP") ;
      this.cNominal   = this.navParams.get("Nominal") ;
      this.nHarga     = this.navParams.get("Harga") ;
      this.cSN        = this.navParams.get("SN") ;
      this.cStatus    = this.navParams.get("Status") ;
      this.cKode      = this.navParams.get("Kode") ;
    }
    
    if(this.cStatus == "S" || this.cStatus == "Sukses"){
      this.cStatus = "Sukses";
    }else if(this.cStatus == "P"){
      this.cStatus = "Proses";  
    }else{
      this.cStatus = "Gagal";
    }
    this.lHide      = this.cSN == "" ? true : false;
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailPulsaPraPage');
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
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