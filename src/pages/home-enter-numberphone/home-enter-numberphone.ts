import { HomeMasukTokenPage } from './../home-masuk-token/home-masuk-token';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Config } from '../../service/config' ;
import { Http, Headers, RequestOptions } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { Func } from '../../service/func';
/**
 * Generated class for the HomeEnterNumberphonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-enter-numberphone',
  templateUrl: 'home-enter-numberphone.html',
})
export class HomeEnterNumberphonePage {
  loading: Loading;
  ltrue = true;
  cNomor = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,private sim: Sim,
              public config: Config,public http: Http,public toastCtrl:ToastController,
              public alertCtrl:AlertController,public loadingCtrl: LoadingController,
              public platform: Platform, public statusbar: StatusBar,public func: Func) {

  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#36884D","gelap");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeEnterNumberphonePage');
  }

  validSaving(){
    if(this.cNomor == ""){
      this.showAlert("Nomor HP kosong...","Perhatian") ;
    }else if(this.cNomor.length < 9){
      this.showAlert("Nomor HP tidak valid...","Perhatian") ;
    }else{
      let alert = this.alertCtrl.create({
        title: 'Konfirmasi',
        message:'Apakah nomor ini benar? <br><br><b>+62 ' + this.cNomor + '</b></br></br>',
        cssClass: 'msg',
        buttons: [
          {
            text: 'Ganti', 
            role: 'cancel', 
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Benar',
            handler: data => { 
              this.sim.getSimInfo().then( 
                (info)  => this.prosesSayaMauToken("+62"+this.cNomor,info['simSerialNumber']),
                (err)   => ""
              );
            }
          }
        ]
      });
      alert.present();
    }
  }

  prosesSayaMauToken(cNoHP,cSIM){   
    this.showLoading();
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers }); 
    var cBody = { 
                  TRX: this.config.GetToken,  
                  HP: cNoHP,
                  SIMSerial: this.config.KodeBank+cSIM
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
          let vaRes = res[0].split("|") ; 
          if(vaRes[0] == "00"){
            // simpan nomor hp agar user tidak perlu lagi input no hp nya
            localStorage.setItem("nomorhpgan",cNoHP.replace('+62','0'));
            this.navCtrl.push(HomeMasukTokenPage,{},{animate:true}) ; 
          } 
          this.showAlert(vaRes[1],"Info") ;  
        }  
        console.log("Respon e: " + res.text) 
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
    }) ;  
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

  public showAlert(msg:string,title:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    }); 
    alert.present();
  }

  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  } 

}
