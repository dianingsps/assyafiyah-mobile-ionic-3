import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController,ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { PaymentListrikBayarPage } from '../payment-listrik-bayar/payment-listrik-bayar' ;

@IonicPage()
@Component({
  selector: 'page-payment-listrik',
  templateUrl: 'payment-listrik.html',
})
export class PaymentListrikPage {
  loading: Loading;
  data:any = {} ; 
  cNomor = '' ;
  lTrue = true ;
  cError = "" ;
  rootNavCtrl = NavController ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,public modalCtrl: ModalController) { 
    this.lTrue = true ;
    this.cError = "" ;
    this.rootNavCtrl = navParams.get('rootNavCtrl');
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
      this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let cDE48 = "0201*1001*INQPLN~~FP_PLNPASCA" ;  
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
                    DE103: this.cNomor
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
          if(res['DE039']== "00"){  
            let vaInfo = res['DE048'].split("|") ;  
            let cBlth1 = vaInfo[4];
            let cBlth2 = vaInfo[9];
            let cBlth3 = vaInfo[10];
            let cBlth4 = vaInfo[11];
            if(vaInfo[0] == "kosong"){  
              this.showAlert("Informasi :","Nomor Pelanggan tidak ditemukan...") ;
            }else{  
              let profileModal = this.modalCtrl.create(PaymentListrikBayarPage, {
                'IDPel': vaInfo[0], 
                'Nama': vaInfo[1],
                'Periode': cBlth1 !== "kosong" ? this.func.getNamaBulan(parseInt(cBlth1.substring(4))) + cBlth1.substring(2,4) : "",
                'Daya': vaInfo[2] + "/" + parseInt(vaInfo[3]),
                'Usage': vaInfo[5], 
                'Tagihan': vaInfo[6],
                'Admin': vaInfo[7],
                'Ref' : vaInfo[8], 
                'Blth2' : cBlth2 !== "kosong" ? this.func.getNamaBulan(parseInt(cBlth2.substring(4))) + cBlth2.substring(2,4) : "",
                'Blth3' : cBlth3 !== "kosong" ? this.func.getNamaBulan(parseInt(cBlth3.substring(4))) + cBlth3.substring(2,4) : "",
                'Blth4' : cBlth4 !== "kosong" ? this.func.getNamaBulan(parseInt(cBlth4.substring(4))) + cBlth4.substring(2,4) : ""
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
