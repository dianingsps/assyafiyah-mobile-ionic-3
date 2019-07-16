import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController, ModalController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;  
//import { SQLite } from '@ionic-native/sqlite'; 
import { PulsaListrikBayarPage } from '../pulsa-listrik-bayar/pulsa-listrik-bayar' ;

/**
 * Generated class for the TransferProsesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pulsa-listrik',
  templateUrl: 'pulsa-listrik.html',
})
export class PulsaListrikPage {
  loading: Loading;  
  cRekening = '' ;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;  
  cNomor = "" ;
  cNominal = "" ;
  nNominal = "" ;
  data = [] ; 
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,
              public modalCtrl: ModalController,
              //private sqlite: SQLite
              ) {
    //let n = 0 ;  
    let cRekeningAsal = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekeningAsal.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ;
    this.cRekening = localStorage.getItem("RekeningUtama") ; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulsaListrikPage');
  }

  dismiss(){
    this.navCtrl.pop() ;
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
      content: 'Please wait...',
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
      this.cError += "ID Pelanggan harus diisi ...\n" ;
    }else if(this.cNomor !== "" && this.cNomor.length <= 9){
      this.lTrue = false ;
      this.cError += "ID Pelanggan tidak valid ...\n" ;
    }else{  
      this.lTrue = true ;
      this.cError = "" ;
    } 
   
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      if(this.cNomor.length == 11) localStorage.setItem("PakaiNomorMeter","1") ; 
      this.saving() ;
    }
  }
  
  saving(){    
    if(this.lTrue == true){
      this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let cDE48 = "0201*1001*INQPLN~~FP_PLNPRAH" ;  
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
                    DE052: "0000000000000000000000000000000000000000000000000000000000000000",
                    DE061: cSIMSerial, 
                    DE102: localStorage.getItem("RekeningUtama"),
                    DE103: this.cNomor
                  }   
      var cRequest = {  
                      MTI: "002",
                      MSG: cBody
                      }                   
      let data = "cCode="+JSON.stringify(cRequest) ;    
      console.log("Request e inquiry pln pra: "+data); 

      this.http.post(this.config.cURL,data,options)
      .map(res => res.json()) 
      .subscribe(res => { 
          if(res['DE039']== "00"){   
            let vaInfo = res['DE048'].split("|") ;  
            if(vaInfo[0] == "kosong"){  
              this.showAlert("Informasi :","Nomor Pelanggan tidak ditemukan...") ;
            }else{  
              let profileModal = this.modalCtrl.create(PulsaListrikBayarPage, {
                'NoMeter': vaInfo[0], 
                'IDPel': vaInfo[1], 
                'Nama': vaInfo[2],
                'Daya': vaInfo[3] + "/" + parseInt(vaInfo[4]),
                "Ref": vaInfo[5]
              });  
              profileModal.present();
            }  
          }else if(res['DE039'] == "undefined" || res['DE039'] == null){
            this.showAlert("Pesan :","Request timeout...Coba lagi nanti") ;
          }else{
            this.showAlert("Pesan :",this.func.getRCFastpay(res['DE039'])) ;
          }
          console.log("Respon e: " + res.text) 
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