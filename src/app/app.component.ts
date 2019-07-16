import { SettingPage } from './../pages/setting/setting';
import { LoginPage } from './../pages/login/login';
import { HomePage } from './../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AkunPage } from '../pages/akun/akun';
import { PulsaPage } from '../pages/pulsa/pulsa';  
import { BpjsPage } from '../pages/bpjs/bpjs';
import { PaymentPage } from '../pages/payment/payment';
import { RiwayatPage } from '../pages/riwayat/riwayat';
import { Config } from '../service/config';
import { HomeMenuPage } from '../pages/home-menu/home-menu';
import { AkunListMutasiPage } from '../pages/akun-list-mutasi/akun-list-mutasi';

@Component({  
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;  
  StatusApp = localStorage.getItem("StatusApp") ;
  public counter = 0;
  rootPage: any; 
  //rootPage: any = HomePage;       
  //rootPage: any = IndexPage; 
  //rootPage: any = LoginPage; 
  //rootPage: any = HomeSlidesPage ;

  pages: Array<{title: string, component: any}>;
  cNamaNasabah = localStorage.getItem("NamaNasabah") ; 
  constructor(public platform: Platform, public splashScreen: SplashScreen,
              public alertCtrl:AlertController,private androidPermissions: AndroidPermissions,
              public toastCtrl:ToastController,public config:Config) {

    if(localStorage.getItem("masuk") == "1"){
      location.reload();
      localStorage.setItem("masuk","0");
    }                
    localStorage.setItem("nomorhpgan","");
    this.initializeApp();
 
    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Pesan Saya', component: PesanSayaPage },
      { title: 'Home', component: HomeMenuPage },
      { title: 'Informasi Rekening', component: AkunPage },
      //{ title: 'Kirim Uang Antar Bank', component: TransferAntarBankPage },
      { title: 'Prabayar', component: PulsaPage },
      { title: 'Pascabayar', component: PaymentPage },
      { title: 'BPJS', component: BpjsPage },
      { title: 'Riwayat', component: RiwayatPage },
    ]; 
    this.cNamaNasabah = localStorage.getItem("NamaNasabah") ;
    if(localStorage.getItem("AppLogin") == "1"){
      this.rootPage = LoginPage  ; // IndexPage    login masuk app saja
      // this.rootPage = AkunListMutasiPage
    } else {
      this.rootPage = HomePage ; // register dulu yaa  
    }  

    // let platformVersion = platform.versions();
    // if (platformVersion.android) {
    //   //let androidV = platformVersion.android.num;
    //   if(androidV => 6.0){
    //     this.statusBar.backgroundColorByHexString('#36884D'); 
    //     this.statusBar.styleDefault();
    //   }else{ 
    //     this.statusBar.styleLightContent();
    //   }
    // }else{ 
    //   this.statusBar.styleDefault();
    // }   

    this.platform.registerBackButtonAction(() => {
      // Get the current page
      let pageName = this.nav.getActive().name;
      if(pageName != 'SettingPage' && pageName != 'FeedPage') {
        if (this.nav.canGoBack()){
          this.nav.pop();
        } else {
          if (this.counter == 0) {
            this.counter++;
            this.showToast("Tekan lagi untuk keluar");
            setTimeout(() => { this.counter = 0 }, 3000)
          }else{
            platform.exitApp();
          }
        }
      }else{
        this.nav.pop();
      }
    },0);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();

      // get permission for android 6.0 above 
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.READ_PHONE_STATE, 
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      ]); 

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //this.nav.setRoot(page.component);
    let cLogin = "1" ; //localStorage.getItem("cLogin") ;
    if(cLogin == "1"){
      this.nav.setRoot(page.component);
    }else{
      this.showAlert("Perhatian","Anda harus login terlebih dahulu...") ;
    }    
  }

  openSetting(){
    this.nav.push(SettingPage);
  }

  openFeed(){
    //this.nav.push(FeedPage);
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  showToast(cMessage) {
    let toast = this.toastCtrl.create({
      message: cMessage,
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }  

}