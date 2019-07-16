import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController,ModalController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { PaymentCicilanBayarPage } from '../payment-cicilan-bayar/payment-cicilan-bayar' ;

@IonicPage()
@Component({
  selector: 'page-payment-cicilan',
  templateUrl: 'payment-cicilan.html',
})
export class PaymentCicilanPage {
  loading: Loading;
  data:any = {} ; 
  cRekening = '' ; 
  cNomor = '' ;
  cFinance = '' ;
  places: {title:string}[] = [] ;
  selectedValue: number;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;
  rootNavCtrl = NavController ;
  hidden1 = true;
  hidden2 = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,public modalCtrl: ModalController) { 
    //let n = 0 ; 
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ;
    this.cRekening = localStorage.getItem("RekeningUtama") ; 
    this.rootNavCtrl = navParams.get('rootNavCtrl');
    if(localStorage.getItem("MenuCicilan") == "0"){
      this.hidden1 = false;
      this.hidden2 = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentCicilanPage');
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
    }else if(this.cFinance == ""){
      this.lTrue = false ;
      this.cError += "Perusahaan Harap Diisi...\n" ;
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
      let cDE48 = "0501*1001*INQFINANCE~~" + this.cFinance ; 
      var cBody = {  
                    TRX: "23",  
                    DE003: "231000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cDE48,  
                    DE052: "0000000000000000000000000000000000000000000000000000000000000000",
                    DE061: cSIMSerial,
                    DE102: this.cRekening,
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
            if(vaInfo[0] !== "00"){ 
              this.showAlert("Perhatian :",this.func.getRCBiller(vaInfo[0])) ;
            }else{ 
              let profileModal = this.modalCtrl.create(PaymentCicilanBayarPage, {
                'Data':vaInfo                           
              });  
              profileModal.present();
            }     
          }else{
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
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
