import { Config } from './../../service/config';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController, Platform } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Sim } from '@ionic-native/sim';
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { FuncDatabase } from '../../service/funcdatabase' ;
//import { IndexPage } from '../index/index' ;
import { HomeSlidesPage } from '../home-slides/home-slides' ;
import { StatusBar } from '@ionic-native/status-bar';

 
@IonicPage()
@Component({
  selector: 'page-home-masuk-token',
  templateUrl: 'home-masuk-token.html',
})
export class HomeMasukTokenPage {
  loading: Loading;
  data:any = {} ; 
  lTrue = true ;
  cError = "" ;
  cToken = "" ;
  cPIN = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              private sim: Sim,
              public alertCtrl: AlertController,
              public func:Func,public funcDatabase:FuncDatabase,
              public statusbar: StatusBar,
              public platform: Platform) { 
    this.lTrue = true ;
    this.cError = "" ;

    this.prepare();
  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#36884D","gelap");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMasukTokenPage');
  }
  
  async prepare(){
    try{ 
      await this.sim.getSimInfo().then( 
        (info) => this.saveThat(info['simSerialNumber']),
        (err) => this.showToast("Unable to get sim info: " + err,"bottom")
      );  
    }catch(e){ 
      this.showToast("Gagal mendeteksi sim... : " + e,"bottom"); 
    }
  }

  saveThat(cSIM){
    localStorage.setItem("SIMSerial",this.config.KodeBank + cSIM) ;
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

  masukproses() {  
    let alert = this.alertCtrl.create({
      title: 'Masukkan No HP :',
      inputs: [
        {
          name: 'HP',
          placeholder: 'No HP',
          type: 'number'
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
            if(data.HP !== ""){
              this.proses(data.HP) ; 
            }else{  
              this.showAlert("Perhatian","HP Harap Diisi..") ;
              return false ; 
            }
          }
        }
      ]
    });
    let nomorhape = localStorage.getItem("nomorhpgan");
    if(nomorhape == ""){
      alert.present();
    }else{
      this.proses(nomorhape) ;
    }
  }

  validSaving(){
    this.cError = "" ;
    if(this.cToken == ""){
      this.lTrue = false ;
      this.cError += "Token Harap Diisi...\n" ;
    }else if(this.cPIN == ""){
      this.lTrue = false ;
      this.cError += "PIN Harap Diisi...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    }


    if(this.cError !== ""){ 
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      this.masukproses();
    }
  }

  proses(cHP){  
    if(this.lTrue == true){
      this.showLoading();
      
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      
      let cPIN = Md5.hashStr(this.cPIN) ;  
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let hp = cHP.replace(cHP.substr(0,1),"62");
      let DE048 = this.cToken + " " + cSIMSerial + " " + hp + " " + "" ; 
      var cBody = { 
                    TRX: "04",  
                    DE003: "041000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: "000000000000",
                    DE039: "00",
                    DE044: "0",
                    DE048: DE048, 
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial, 
                    DE102: "0", 
                    DE103: "0" 
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
              // clear nohp yg tadi disimpan
              localStorage.setItem("nomorhpgan","");  

              // create database
              this.funcDatabase.initDBMutasi() ;
              this.funcDatabase.initDBTransferRekening() ;
              this.funcDatabase.initDBDataProduk() ;
              this.funcDatabase.initDBOperator();
              this.funcDatabase.initDBPesan();
              this.funcDatabase.initDBKodeBank();

              let vaValue = res['DE048'].split("|");
              let cNama   = vaValue[0] ;   
              localStorage.setItem("NamaNasabah",cNama);
              localStorage.setItem("NoHPTerdaftar",vaValue[1]);
              localStorage.setItem("TrxKey",vaValue[2]);
              localStorage.setItem("RekeningNasabah",vaValue[3]);
              localStorage.setItem("KodeCIF",vaValue[4]);
              this.navCtrl.setRoot(HomeSlidesPage);
              this.showToast("Login sukses, selamat datang " + cNama,"bottom");
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