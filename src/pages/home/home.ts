import { Component } from '@angular/core';
import { NavController,AlertController,ToastController,LoadingController,Loading,MenuController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login' ;
import { RegisterPage } from '../register/register' ; 
import { HomeMasukTokenPage } from '../home-masuk-token/home-masuk-token' ; 
import { Func } from '../../service/func' ;
import { FuncDatabase } from '../../service/funcdatabase' ;
import { Sim } from '@ionic-native/sim';
import { SMS } from '@ionic-native/sms';
import { Config } from '../../service/config' ;
import { Http,Headers, RequestOptions } from '@angular/http';
import { HomeSlidesPage } from '../home-slides/home-slides' ;
import { Md5 } from 'ts-md5/dist/md5';
import { HomeEnterNumberphonePage } from '../home-enter-numberphone/home-enter-numberphone';
import { StatusBar } from '@ionic-native/status-bar';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
//import { SQLite } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: Loading;
  constructor(public navCtrl: NavController,public alertCtrl:AlertController,
              public func:Func,public funcDatabase:FuncDatabase,
              private sim: Sim,public toastCtrl:ToastController,
              public loadingCtrl: LoadingController,
              public config: Config,public http: Http,
              private sms:SMS,
              //private androidPermissions: AndroidPermissions,
              //private sqlite: SQLite,
              private menu:MenuController,
              public statusbar: StatusBar,
              public platform: Platform) {
    this.menu.swipeEnable(false) ;
  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#FFFFFF","terang");
  }

  login(){ 
    this.navCtrl.push(LoginPage,{},{animate:true}) ;
  }
  
  sayasudahaktif() {  
    let alert = this.alertCtrl.create({
      title: 'Masukkan PIN:',
      inputs: [
        {
          name: 'password',
          placeholder: 'PIN',
          type: 'password',
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
                this.sim.getSimInfo().then( 
                  (info)  => this.prosesSayaSudakAktif(data.password,info['simSerialNumber']),
                  (err)   => ""
                );  
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

  register(){
    this.navCtrl.push(RegisterPage,{},{animate:true}) ;
  }

  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  } 

  tokenmasuk(){ 
    console.log("yeah");   
    this.navCtrl.push(HomeMasukTokenPage,{},{animate:true}) ; 
  }

  async dapatkantoken(){
    this.navCtrl.push(HomeEnterNumberphonePage,{},{animate:true}) ; 
  } 

  prosesSayaMauToken(cNoHP,cSIM){   
    this.showLoading();
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });      
    var cBody = { 
                  TRX: this.config.GetToken,  
                  HP: cNoHP,
                  SIMSerial: cSIM
                }
    var cRequest = {
                  MTI: "004",
                  MSG: cBody
                  }
    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : "+data);   
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json()) 
    .subscribe(res => {    
        if(res[0] !== undefined){
          this.stopLoading();
          this.showAlert(res[0],"Info") ;  
        }  
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
    }) ;  
  }

  sendSerialSIM(cSIM,cNomor){
    this.confirmAlert("Konfirmasi",
                      "Pastikan SIM 1 adalah default SIM untuk pengiriman sms. Jika sudah, klik lanjut",
                      "Kembali",
                      "Lanjut",cNomor,cSIM
    );
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

  prosesSayaSudakAktif(cPIN,cSIM){   
    localStorage.setItem("SIMSerial",this.config.KodeBank + cSIM);
    this.showLoading();
    
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');

    cPIN = Md5.hashStr(cPIN) ;  
    let cSIMSerial = this.config.KodeBank + cSIM ;
    
    var cBody = { 
                  TRX: "08",  
                  DE003: "081000",
                  DE004: "000000000000",
                  DE012: this.func.getTime(), 
                  DE013: this.func.getDate(),
                  DE037: "000000000000",
                  DE039: "00", 
                  DE044: "0",
                  DE048: "", 
                  DE052: "00000000000000000000000000000000" + cPIN,
                  DE061: cSIMSerial,
                  DE102: "", 
                  DE103: ""
                }  
    var cRequest = {
                  MTI: "002",
                  MSG: cBody
                  } 
    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e asem : "+data);        
    this.http.post(this.config.cURL,data,options)  
      .map(res => res.json())     
      .subscribe(res => {     
        console.log("asem " + res['DE039'])      
          this.stopLoading();  
          if(res['DE039']== "00"){ 
            
            // create database
            this.funcDatabase.initDBMutasi() ;
            this.funcDatabase.initDBTransferRekening() ;
            this.funcDatabase.initDBDataProduk() ;
            this.funcDatabase.initDBOperator();
            this.funcDatabase.initDBPesan();
            this.funcDatabase.initDBKodeBank();

            console.log("Respon e: " + res['DE048']);  
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
            this.showAlert(this.func.getRC(res['DE039']),"Pesan :")
          }        
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
    }) ;   
  }

  public showAlert(msg:string,title:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    }); 
    alert.present();
  }

  confirmAlert(judul:string, pesan:string, negativeText:string, positiveText:string,cNomor,cSIM) {
    let dialog = this.alertCtrl.create({
      title: judul,
      message: pesan,
      buttons: [
        {
          text: negativeText,
          role: 'cancel',
          handler: () => {}
        },  
        {
          text: positiveText,
          handler: () => { 
            let cSIMSerial = this.config.KodeBank + cSIM;
            let cMsg = 'token-mbanking ' + cSIMSerial;
            //alert(cSIMSerial);
            this.sms.send(cNomor,cMsg) ;
            localStorage.setItem("SIMSerial",cSIMSerial) ;
            this.navCtrl.push(HomeMasukTokenPage,{},{animate:true}) ; 
            this.showAlert("Mohon tunggu SMS konfirmasi token dalam beberapa menit","Info");
          }
        }
      ]
    });
    dialog.present();
  }

}
