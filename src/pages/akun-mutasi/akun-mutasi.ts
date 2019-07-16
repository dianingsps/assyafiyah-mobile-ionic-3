import { AkunListMutasiPage } from './../akun-list-mutasi/akun-list-mutasi';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController,ModalController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
//import { AkunMutasiDetailPage } from '../akun-mutasi-detail/akun-mutasi-detail';


@IonicPage()
@Component({
  selector: 'page-akun-mutasi',
  templateUrl: 'akun-mutasi.html',
})
export class AkunMutasiPage {
  loading: Loading;
  data:any = {} ; 
  cRekening = '' ;
  cTglMulai: String = new Date().toISOString();
  cTglSelesai: String = new Date().toISOString();
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
              public modalCtrl: ModalController,
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
    console.log('ionViewDidLoad AkunMutasiPage');
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
      title: 'Masukkan PIN :',
      inputs: [
        {
          name: 'password',
          placeholder: 'PIN',
          type: 'password'
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
      let tgl1 = this.func.string2Date(this.cTglMulai.substring(0,10));
      let tgl2 = this.func.string2Date(this.cTglSelesai.substring(0,10));
      var cBody = { 
                    TRX: "02",  
                    DE003: "021000",
                    DE004: "000000000000", 
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0", 
                    DE048: tgl1 + " " + tgl2, 
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekening,
                    DE103: "",
                    DE105: "",
                    DE106: "",
                    DE107: "",
                    DE108: "",
                    DE109: "",
                    DE110: ""                    
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
              let cData = res['DE048'];
              if(res['DE105'] != "") cData += res['DE105'];
              if(res['DE106'] != "") cData += res['DE106'];
              if(res['DE107'] != "") cData += res['DE107'];
              if(res['DE108'] != "") cData += res['DE108'];
              if(res['DE109'] != "") cData += res['DE109'];
              if(res['DE110'] != "") cData += res['DE110'];
              let vaMutasi = res['DE048'].split("|") ;
              let profileModal = this.modalCtrl.create(AkunListMutasiPage, {
                'Mutasi': vaMutasi
              });  
              profileModal.present();
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
