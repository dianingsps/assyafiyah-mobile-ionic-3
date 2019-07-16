import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;

 
@IonicPage()
@Component({
  selector: 'page-setting-ganti-pass',
  templateUrl: 'setting-ganti-pass.html',
})
export class SettingGantiPassPage {
  loading: Loading;
  data:any = {} ; 
  lTrue = true ;
  cError = "" ;
  cPasswordLama = "" ;
  cPasswordBaru = "" ;
  cKetikPasswordBaru = "" ;
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
    console.log('ionViewDidLoad SettingGantiPasswordPage');
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
    if(this.cPasswordLama == ""){
      this.lTrue = false ;
      this.cError += "Password Lama Harap Diisi...\n" ;
    }else if(this.cPasswordBaru == ""){
      this.lTrue = false ;
      this.cError += "Password Baru Harap Diisi...\n" ;
    }else if(this.cPasswordBaru !== this.cKetikPasswordBaru){
      this.lTrue = false ;
      this.cError += "Kombinasi Password Baru Tidak cocok...\n" ;
    }else if(this.cPasswordLama !== localStorage.getItem("PasswordApp")){
      this.lTrue = false ;
      this.cError += "Password Lama Tidak cocok...\n" ; 
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
      //localStorage.setItem("AppLogin","1") ;   
      localStorage.setItem("PasswordApp",this.cPasswordBaru) ;   
      this.stopLoading() ; 
      this.showToast("Password berhasil diganti","bottom") ;
      this.cKetikPasswordBaru = "";
      this.cPasswordBaru = "";
      this.cPasswordLama = "";
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
