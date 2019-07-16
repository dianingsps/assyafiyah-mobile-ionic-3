import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;

 
@IonicPage()
@Component({
  selector: 'page-setting-ganti-pin',
  templateUrl: 'setting-ganti-pin.html',
})
export class SettingGantiPinPage {
  loading: Loading;
  data:any = {} ; 
  lTrue = true ;
  cError = "" ;
  cPINLama = "" ;
  cPINBaru = "" ;
  cKetikPINBaru = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func) { 
    this.lTrue = true ;
    this.cError = "" ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingGantiPinPage');
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
    if(this.cPINLama == ""){
      this.lTrue = false ;
      this.cError += "PIN Lama Harap Diisi...\n" ;
    }else if(this.cPINBaru == ""){
      this.lTrue = false ;
      this.cError += "PIN Baru Harap Diisi...\n" ;
    }else if(this.cPINBaru !== this.cKetikPINBaru){
      this.lTrue = false ;
      this.cError += "Kombinasi PIN Baru Tidak cocok...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    }


    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }
  }

  proses(){  
    this.validSaving() ; 
    if(this.lTrue == true){
      this.showLoading();
      
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      
      let cPINBaru = Md5.hashStr(this.cPINBaru) ;
      let cPINLama = Md5.hashStr(this.cPINLama) ;
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      var cBody = { 
                    TRX: "07",  
                    DE003: "071000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cPINBaru, 
                    DE052: "00000000000000000000000000000000" + cPINLama,
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
            if(res['DE039']== "00"){ 
              this.showAlert("Sukses :","PIN Berhasil Diganti") ;
              this.cPINBaru = "";
              this.cPINLama = "";
              this.cKetikPINBaru = "";
            }else{
              this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
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
