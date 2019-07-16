import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { HTTP } from '@ionic-native/http';
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;


@IonicPage()
@Component({
  selector: 'page-akun-ceksaldo',
  templateUrl: 'akun-ceksaldo.html',
})
export class AkunCeksaldoPage {
  loading: Loading; 
  data:any = {} ; 
  cRekening = '' ;
  places: {title:string}[] = [] ;
  selectedValue: number;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func) { 
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ; 
    this.cRekening = localStorage.getItem("RekeningUtama") ; 
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
    if(this.cRekening == ""){
      this.lTrue = false ;
      this.cError += "Rekening Harap Diisi...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    } 
 
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }
  }

  proses() {  
    let alert = this.alertCtrl.create({
      title: 'Masukkan PIN:',
      inputs: [
        {
          name: 'password',
          placeholder: 'PIN',
          type: 'password',
          max:'6'
        }
      ], 
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => { 
            if(data.password !== ""){
              if(data.password.length == '6'){
                this.saving(data.password) ; 
              }else{
                alert.setMessage("PIN tidak valid, periksa kembali");
                return false ;  
              }
            }else{ 
              alert.setMessage("PIN harus diisi");
              return false ;
            }
          }
        }
      ]
    });
    alert.present();
  }
 
  saving(PIN){   
    this.validSaving() ; 
    if(this.lTrue == true){
      this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      
      let cPIN = Md5.hashStr(PIN) ;
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      var cBody = { 
                    TRX: "01",  
                    DE003: "011000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: "", 
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekening,
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
            let vaSaldo = res['DE044'].split(" ") ;  
            let vaKet   = res['DE048'].split("|") ;  
            let nSaldo  = this.func.number2String(parseInt(vaSaldo[1].substring(0,10)),2) ;
            let Saldo   = "<br> Tgl: "+vaKet[0];
            Saldo      += "<br> Rekening : "+vaKet[1] + "<br>";
            Saldo      += "<br><font size='4px'><b>Rp. " + nSaldo.toString() + "</b></font>" ;
            this.showAlert("Saldo Anda",Saldo) ;
          }else{
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
          }  
          console.log("Respon e: " + res.text) 
          this.stopLoading();   
        }, (err) => {
          console.log()           
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
