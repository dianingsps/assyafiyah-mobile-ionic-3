import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,LoadingController,Loading } from 'ionic-angular';
import { Screenshot } from '@ionic-native/screenshot';
import { Func } from '../../service/func' ;
import { Http } from '@angular/http';
import { Config } from '../../service/config' ;
import { App, ViewController } from 'ionic-angular';
/**
 * Generated class for the RiwayatDetailPlnPraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-pln-pra',
  templateUrl: 'riwayat-detail-pln-pra.html',
})
export class RiwayatDetailPlnPraPage {
  cTitle    = '' ;
  dTgl      = '' ;
  cRekening = '' ;
  cMeter    = '' ; 
  cNomor    = '' ;
  cNama     = '' ;
  cDaya     = '' ;
  cRef      = '' ;
  nAdminBank= 0 ;
  nMaterai  = 0 ;
  nPPN      = 0 ;
  nPPJ      = 0 ;
  nAngsuranDaya = 0 ;
  nStroom   = 0 ;
  nKWH      = 0 ;
  cToken    = '' ;
  cStatus   = 'Proses' ;
  cKet      = '';
  nTotal    = 0;
  cKode     = '';
  cTrxID    ='';
  lHide     = false;
  lHideKeterangan = true;
  lHide1    = true;
  data:any  = {} ; 
  places: {title:string}[] = [] ;
  selectedValue: number;
  loading: Loading;

  cData = '';
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private screenshot : Screenshot,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public func:Func,public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public viewCtrl: ViewController,
              public appCtrl: App) { 
       this.cData = this.navParams.get("getItem"); 
       console.log('getData->',this.cData);
       if(this.cData != null){
        this.cTitle     = "PLN PRABAYAR" ;
        this.cRekening  = this.cData["Rekening"] ;
        this.dTgl       = this.cData["Tgl"] ;
        this.cMeter     = this.cData["Meter"] ;
        this.cNomor     = this.cData["Nomor"] ;
        this.cNama      = this.cData["Nama"] ;
        this.cDaya      = this.cData["Daya"]; 
        this.cRef       = this.cData["NoRef2"] ;
        this.nAdminBank = this.cData["BiayaAdmin"] ;
        this.nMaterai   = this.cData["Materai"] ;
        this.nPPN       = this.cData["PPn"] ;
        this.nPPJ       = this.cData["PPj"] ;
        this.nAngsuranDaya = this.cData["Angsuran"] ;
        this.nStroom    = this.cData["Stroom"] ;
        this.nKWH       = this.cData["KWH"] ;
        this.cToken     = this.cData["Token"] ;
        this.cStatus    = this.cData["Status"] ;
        this.nTotal     = this.cData["TotalBayar"] ;
        this.cKet       = this.cData["Ket"] ;
        this.cKode      = this.cData["Kode"] ;
        this.cTrxID     = this.cData["TrxID"] ;
      }else{
        this.cTitle     = "PLN PRABAYAR" ;
        this.cRekening  = this.navParams.get("Rekening") ;
        this.dTgl       = this.navParams.get("Tgl") ;
        this.cMeter     = this.navParams.get("Meter") ;
        this.cNomor     = this.navParams.get("Nomor") ;
        this.cNama      = this.navParams.get("Nama") ;
        this.cDaya      = this.navParams.get("Daya") ;
        this.cRef       = this.navParams.get("NoRef2") ;
        this.nAdminBank = this.navParams.get("BiayaAdmin") ;
        this.nMaterai   = this.navParams.get("Materai") ;
        this.nPPN       = this.navParams.get("PPn") ;
        this.nPPJ       = this.navParams.get("PPj") ;
        this.nAngsuranDaya = this.navParams.get("Angsuran") ;
        this.nStroom    = this.navParams.get("Stroom") ;
        this.nKWH       = this.navParams.get("KWH") ;
        this.cToken     = this.navParams.get("Token") ;
        this.cStatus    = this.navParams.get("Status") ;
        this.nTotal     = this.navParams.get("TotalBayar") ;
        this.cKet       = this.navParams.get("Ket") ;
        this.cKode      = this.navParams.get("Kode") ;
        this.cTrxID     = this.navParams.get("TrxID") ;
      }

      if(this.cStatus == "S" || this.cStatus == "Sukses"){
        this.cStatus = "Sukses";
      }else if(this.cStatus == "P"){
        this.cStatus = "Proses";  
      }else{
        this.cStatus = "Gagal";
      }

    //this.lHide      = this.navParams.get("Status") == "Gagal" ? true : false; 
    if(this.cKet.indexOf("akan dikirim via SMS") > 0){
      this.lHide = true;
      this.lHideKeterangan = false;
    }

  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailPlnPraPage');
    this.showLoading();
    this.stopLoading();
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
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

  capture(){
    let dt = this.func.SNow().replace(' ','_');
    dt     = dt.replace('-','');
    this.screenshot.save('jpg', 95, 'plnprabayar'+dt)
      .then(() => this.showAlert("Info","Hasil capture disimpan di folder '/Pictures'"))
      .catch(e => alert("Gagal capture"))
  }

}