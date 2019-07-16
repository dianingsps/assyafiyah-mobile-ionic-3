import { Config } from './../../service/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AkunMutasiDetailPage } from './../akun-mutasi-detail/akun-mutasi-detail';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { Func } from '../../service/func' ;

/**
 * Generated class for the AkunListMutasiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-akun-list-mutasi',
  templateUrl: 'akun-list-mutasi.html',
})
export class AkunListMutasiPage {
  loading: Loading; 
  vaMutasi  = [];
  icon      = "trending-down";
  myIconColor: string = '#ca0303'; //red
  data      = [];
  cTitle    = "Mutasi Rekening";
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public http: Http,
              public loadingCtrl: LoadingController,public config: Config,
              public func:Func,public modalCtrl: ModalController,
              public toastCtrl: ToastController) {
  this.vaMutasi   = this.navParams.get("Mutasi") ;
  this.fetchMutasi(this.vaMutasi); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AkunListMutasiPage');
  }

  // fetchMutasi(vaMutasi){
  //   for(let i=1; i < 6; i++){
  //     let cID      = "0001";
  //     let nNominal = "100000" ;
  //     let dTgl     = "2018-09-19";
  //     let cJenis   = "";
  //     let cIkon    = "";
  //     let cWarna   = "";
  //     nNominal = "100000" ; 
  //     cIkon = "trending-up";
  //     cWarna = "#09ce44";
  //     cJenis = "Kredit" ;
  //     this.data.push({
  //       jenis:cJenis,
  //       tgl:dTgl,
  //       id:cID,
  //       ikon:cIkon,  
  //       warna :cWarna,
  //       nominal:this.func.number2String(parseInt(nNominal.substring(0,10)),2)
  //     });
  //   }  
  // }

  fetchMutasi(vaMutasi){
    let nMutasi   =  this.vaMutasi.length ;
    for(let i=1; i < nMutasi; i++){
      let vaDetail = this.vaMutasi[i].split("_") ;  
      let cID      = vaDetail[0];
      let nNominal = vaDetail[4] ;
      let dTgl     = vaDetail[1].replace(/"-"/g,"/");
      let cJenis   = "";
      let cIkon    = "";
      let cWarna   = "";
      if(vaDetail[2] == "K"){
        nNominal = vaDetail[5] ; 
        cIkon = "trending-up";
        cWarna = "#09ce44";
        cJenis = "Kredit" ;
      }else if(vaDetail[2] == "D"){
        nNominal = vaDetail[4] ; 
        cIkon = "trending-down";
        cWarna = "#ca0303";
        cJenis = "Debet" ;
      }
      if(nNominal == undefined) nNominal = "0.00";
      //console.log("nNominal " + nNominal);
      this.data.push({
        jenis:cJenis,
        tgl:dTgl,
        id:cID,
        ikon:cIkon,  
        warna :cWarna,
        nominal:this.func.number2String(parseInt(nNominal.substring(0,10)),2)
      });
    }  
  }

  dismiss(){
    this.navCtrl.pop() ; 
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Memuat detail transaksi ...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  }

  detail(va){
    this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      
      let cSIMSerial = localStorage.getItem("SIMSerial") ;  
      var cBody = { 
                    TRX: "30",  
                    DE003: "301000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: "000000000000",
                    DE039: "00",
                    DE044: "0", 
                    DE048: va.id, 
                    DE052: "00000000000000000000000000000000" + "00000000000000000000000000000000",
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
            let vaDetail = res['DE048'];
            let profileModal = this.modalCtrl.create(AkunMutasiDetailPage,{
              'detail':vaDetail
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
