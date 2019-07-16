import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, ToastController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../service/config';
import { Func } from '../../service/func';
import { BpjsBayarPage } from '../bpjs-bayar/bpjs-bayar';

/**
 * Generated class for the BpjsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bpjs',
  templateUrl: 'bpjs.html',
})
export class BpjsPage {
  loading: Loading;
  data:any = {} ; 
  cNomor = '' ;
  cPeriode = '' ;
  lTrue = true ;
  cError = "" ;
  rootNavCtrl = NavController ;
  optionsList: Array<{ value: string, text:String, checked: boolean }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,public modalCtrl:ModalController) { 
    this.lTrue = true ;
    this.cError = "" ;
    this.rootNavCtrl = navParams.get('rootNavCtrl');
    var vaPeriode  = ["1","2","3","4","5"];    
    for (var i = 0; i < vaPeriode.length; i++) {  
      this.optionsList.push({ value: vaPeriode[i],text:" bulan",checked: false });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentListrikPage');
  }
  
  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Memuat data...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

  validSaving(){
    this.cError = "" ;
    if(this.cNomor == ""){
      this.lTrue = false ;
      this.cError += "Nomor Pelanggan Harap Diisi...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    } 
 
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      this.saving() ;
    }
  }

  saving(){    
    if(this.lTrue == true){
      //this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let cNoPeserta = "88888" + this.cNomor.substring(2);

      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let cDE48 = "0202*1001*INQBPJS~~ASRBPJSKS~~" + this.cPeriode  ;  
      var cBody = {  
                    TRX: "23",  
                    DE003: "231041",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cDE48,  
                    DE052: "00000000000000000000000000000000" + "00000000000000000000000000000000",
                    DE061: cSIMSerial, 
                    DE102: localStorage.getItem("RekeningUtama"),
                    DE103: cNoPeserta
                  }   
    var cRequest = {  
                    MTI: "002",
                    MSG: cBody
                    }                   
    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request bpjs e : "+data); 
    this.http.post(this.config.cURL,data,options) 
      .map(res => res.json()) 
      .subscribe(res => {
          if(res['DE039']== "00"){  
            let vaInfo = res['DE048'].split("|") ;  
            if(vaInfo[0] == "kosong"){  
              this.showAlert("Informasi :","Nomor Pelanggan tidak ditemukan...") ;
            }else{  
              let profileModal = this.modalCtrl.create(BpjsBayarPage, {
                'NoResi': vaInfo[0],
                'NoPeserta': vaInfo[1],
                'Nama': vaInfo[2],
                'JmlPeserta': vaInfo[3], 
                'NoHP': vaInfo[4] == "kosong" ? "-" : vaInfo[4],                
                'JmlPremi' : vaInfo[5], 
                'Tagihan' :  vaInfo[6],
                'BiayaAdmin' :  vaInfo[7],
                'NoRef': vaInfo[8]
              });  
              profileModal.present();
            }     
          }else{
            this.showAlert("Pesan :",this.func.getRCFastpay(res['DE039'])) ;
          } 
          this.stopLoading(); 
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
      }) ;
  
    }
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }
}