import { AkunPage } from './../akun/akun';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController,MenuController, Platform } from 'ionic-angular';
import { RegisterPage } from '../register/register' ;
import { Http, Headers, RequestOptions } from '@angular/http';
//import { HTTP } from 'ionic-native';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Func } from '../../service/func';
import { Sim } from '@ionic-native/sim';
import { Md5 } from 'ts-md5/dist/md5';
import { StatusBar } from '@ionic-native/status-bar';
import { HomeMenuPage } from '../home-menu/home-menu';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  data:any = {} ; 
  cNamaNasabah = '';
  cUserName = '' ;
  cPassword = '' ;
  places: {title:string}[] = [] ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public menu: MenuController,
              public func:Func,
              private sim: Sim,
              public alertCtrl:AlertController,
              public statusbar: StatusBar,
              public platform: Platform) {
              
    this.cNamaNasabah = localStorage.getItem("NamaNasabah");
  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#FFFFFF","terang");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menu.swipeEnable(false);
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

  signin(){  
    if(this.cPassword == ""){
      this.showAlert("Perhatian :","Password harus diisi")  
    }else{
      this.showLoading();
      if(localStorage.getItem("PasswordApp") == this.cPassword){
        // this.navCtrl.setRoot(AkunPage);
        this.navCtrl.setRoot(HomeMenuPage);
      }else{
        this.showAlert("Perhatian :","Password salah. Periksa kembali lalu masuk kembali")
        this.cPassword = "";
      }
      this.stopLoading();
    }
  }

  showPIN(){
    let alert = this.alertCtrl.create({
      subTitle: 'Ketikkan password baru dengan panjang 6 digit',
      inputs: [
        {
          name: 'password1',
          placeholder: 'Masukkan password baru',
          type: 'password',
        },
        {
          name: 'password2',
          placeholder: 'Ketik ulang password baru',
          type: 'password'
        },
        {
          name: 'pin',
          placeholder: 'Masukkan PIN',
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
            if(data.password1 !== "" && data.password2 !== "" && data.pin !== ""){
              if(data.password1 !== data.password2){
                alert.setMessage("Password tidak cocok, periksa kembali");
                return false ;  
              }else{
                this.sim.getSimInfo().then( 
                  (info)  => this.lupapassword(data.password1,data.pin,info['simSerialNumber']),
                  (err)   => ""
                );
              }
            }else{ 
              alert.setMessage("Data harus diisi semua");
              return false ;
            }
          }
        }
      ]
    });
    alert.present();
  }

  lupapassword(cPassword,cPIN,cSIM){
    this.showLoading();
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');

    cPIN = Md5.hashStr(cPIN) ;  
    let cSIMSerial = this.config.KodeBank + cSIM ;
    

    var cBody = { 
                  TRX: "14",  
                  DE003: "141000",
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
    this.http.post(this.config.cURL,data,options)  
    .map(res => res.json())     
    .subscribe(res => {           
        this.stopLoading();  
        if(res['DE039']== "00"){
          localStorage.setItem("PasswordApp",cPassword);
          this.showToast("Password berhasil diganti","bottom");
        }else{   
          this.showAlert("Pesan :",this.func.getRC(res['DE039']));
        }        
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
      this.stopLoading(); 
    }) ;
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
