import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 
import {Platform} from 'ionic-angular';

/**
 * Generated class for the TransferProsesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting-ambil-produk',
  templateUrl: 'setting-ambil-produk.html',
})
export class SettingAmbilProdukPage {
  loading: Loading;  
  lTrue = true ;
  cError = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public platform: Platform,
              public func:Func,private sqlite: SQLite) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingAmbilProdukPage');
  }

  dismiss(){
    this.navCtrl.pop() ;
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
      content: 'Mengunduh data. Ini mungkin memerlukan waktu beberapa menit...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

  validSaving(){
    this.cError = "" ;
 
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      this.saving() ;
    }
  }

  saving(){   
    if(this.lTrue == true){
      this.delMutasi() ;
      this.showLoading();
      
      let cTrxKey = localStorage.getItem("TrxKey") ;     
      this.requestAmbilDataProduk(cTrxKey);   
      this.requestAmbilDataMenu(cTrxKey);
    }
  }
  
  requestAmbilDataMenu(cTrxKey){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });      
    var cBody = { 
                  TRX: this.config.AmbilDataMenu,  
                  TRXKEY: cTrxKey
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
          let vaProduk = res[0].split("|") ; 
          localStorage.setItem("MenuPulsa",vaProduk[0]);
          localStorage.setItem("MenuBPJS",vaProduk[1]);
          localStorage.setItem("MenuPLN",vaProduk[2]);
          localStorage.setItem("MenuPDAM",vaProduk[3]);
          localStorage.setItem("MenuTelepon",vaProduk[4]);
          localStorage.setItem("MenuCicilan",vaProduk[5]);
          localStorage.setItem("MenuEntertain",vaProduk[6]);
        }  
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
    }) ; 
    this.showToast("Berhasil ambil data fitur","bottom") ;
  }

  requestAmbilDataProduk(cTrxKey){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });      
    var cBody = { 
                  TRX: this.config.AmbilDataProduk,  
                  TRXKEY: cTrxKey
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
        for (var i = 1; i <= 100; i++) {  
          if(res[i] !== undefined){  
            let vaProduk = res[i].split("|") ; 
            this.addMutasi(vaProduk[0],vaProduk[1],vaProduk[2],vaProduk[3],vaProduk[4],vaProduk[5],vaProduk[6],vaProduk[7]) ;
          }  
        }  
        this.showToast("Berhasil ambil data produk","bottom") ;
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
    }) ; 
    return "";
  }

  requestAmbilDataOperator(cTrxKey){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    var cBody = { 
                  TRX: this.config.AmbilDataPrefix,  
                  TRXKEY: cTrxKey
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
        for (var i = 1; i <= 30; i++) {  
          if(res[i] !== undefined){  
            let vaProduk = res[i].split("|") ; 
            this.addDataOperator(vaProduk[0],vaProduk[1],vaProduk[2]) ;
          }  
        }
        this.stopLoading(); 
        this.showToast("Berhasil ambil data operator","bottom") ;
      }, (err) => {
      this.showToast("Failed post data " + err,"bottom") ;
    }) ; 
    return "";
  }   
 
  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  } 
  
  addMutasi(cKode,cKodeStock,cKetOperator,cBiller,cProduk,cKeterangan,cNominal,cJenis){
    let cSQL = "INSERT INTO dataproduk(kode,kodeproduk,biller,produkid,nominal,keterangan,jenis,datetime) " ; 
    cSQL += "VALUES('"+cKode+"','"+cKodeStock+"','"+cBiller+"','"+cProduk+"','"+cNominal+"','"+cKeterangan+"','"+cJenis+"','"+this.func.SNow()+"')" ;
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('insert table dataproduk'))
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }
  
  addDataOperator(cPrefix,cOperator,cKodeOperator){
    let cSQL = "INSERT INTO operator(kode,prefix,kodeoperator) " ; 
    cSQL += "VALUES('"+cOperator+"','"+cPrefix+"','"+cKodeOperator+"')" ;
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('insert table operator'))
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }

  delMutasi(){
    let cSQL = "DELETE FROM dataproduk" ; 
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => this.delDataOperator()) //console.log('delete table dataproduk'))
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }

  delDataOperator(){
    let cTrxKey = localStorage.getItem("TrxKey");
    let cSQL = "DELETE FROM operator" ; 
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => this.requestAmbilDataOperator(cTrxKey)) 
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }

}