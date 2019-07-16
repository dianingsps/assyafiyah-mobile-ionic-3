import { AkunPage } from './../akun/akun';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { HomeMenuPage } from '../home-menu/home-menu';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-home-slides',
  templateUrl: 'home-slides.html',
})
export class HomeSlidesPage {
  @ViewChild(Slides) slides: Slides;

  loading: Loading;
  data:any = {} ; 
  lTrue = true ;
  cError = "" ;
  cPassword = "" ;
  cPasswordUlang = "" ;
  cPINLama = "" ;
  cPINBaru = "" ;
  cPINBaruUlang = "" ;
  cRekening = '' ;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,private sqlite: SQLite,
              public statusbar: StatusBar,
              public platform: Platform) { 
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;     
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ; 
    this.cRekening = localStorage.getItem("RekeningUtama") ;
  }

  ionViewWillEnter(){
    this.func.setStatusBarColor(this.platform,this.statusbar,"#00A13F","gelap");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingGantiPinPage');
  }
  
  
  ionViewDidEnter() {
    this.slides.lockSwipes(true);
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
      content: 'Mengunduh data di background. Ini mungkin memerlukan waktu beberapa menit...', 
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  showLoadingGantiPIN() {
    this.loading = this.loadingCtrl.create({
      content: 'Mengganti PIN...', 
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

  validSaving(){
    this.cError = "" ;
    if(this.cPINLama == "" || this.cPINBaru == "" || this.cPINBaruUlang == ""){
      this.lTrue = false ;
      this.cError += "Data tidak valid, periksa kembali" ;
    }else{ 
      if(this.cPINBaru !== this.cPINBaruUlang){
        this.lTrue = false ;
        this.cError += "Kombinasi PIN Tidak Sesuai" ;
      }else{
        this.lTrue = true ;
        this.cError = "" ;
      }
    }
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }
  }

  setEnableSwipe(lTrue:boolean){
    if(lTrue){
      this.slides.lockSwipes(false);
    }else{
      this.slides.lockSwipes(true);
    }
  }
 
  setPassword(){
    if(this.cPassword == ""|| this.cPasswordUlang == ""){
      this.cError = "Password tidak valid..." ;
      this.showAlert("Perhatian",this.cError) ;
    }else{
      if(this.cPassword !== this.cPasswordUlang){
        this.cError = "Password tidak cocok..." ;
        this.showAlert("Perhatian",this.cError);
      }else{
        localStorage.setItem("PasswordApp",this.cPassword);
        this.setEnableSwipe(true);
        this.slides.slideNext(500);
        this.setEnableSwipe(false);
      }
    }
  }

  gantipin(){   
    this.validSaving() ; 
    if(this.lTrue == true){
      this.showLoadingGantiPIN();
      
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      
      let cPINBaru = Md5.hashStr(this.cPINBaru) ;
      let cPINLama = Md5.hashStr(this.cPINLama) ;
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      var cBody = { 
                    TRX: "07",  
                    DE003: "071000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cPINBaru, 
                    DE052: "00000000000000000000000000000000" + cPINLama,
                    DE061: cSIMSerial,
                    DE102: "", 
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
            this.showAlert("Sukses :","PIN Berhasil Diganti") ;
            this.setEnableSwipe(true);
            this.slides.slideTo(2, 500);
            this.setEnableSwipe(false);
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
  
  skipGantiPIN(){
    this.showAlert("Info","Anda dapat mengganti PIN nanti pada menu pengaturan aplikasi.");
    this.setEnableSwipe(true);
    this.slides.slideTo(2, 500);
    this.setEnableSwipe(false);
  }

  selanjutnya(){  
    localStorage.setItem("RekeningUtama",this.cRekening) ;  
    localStorage.setItem("AppLogin","1") ;
    this.downloadproduk() ;
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  downloadproduk(){    
    if(this.lTrue == true){
      this.showLoading();
      this.delMutasi() ;
      
      let cTrxKey = localStorage.getItem("TrxKey") ;   
      this.requestAmbilDataProduk(cTrxKey);  
      this.requestAmbilDataMenu(cTrxKey);
      this.requestAmbilDataKodeBank();
      //this.showAlert("Info :",cAlert); 
    }
  }
  
  requestAmbilDataKodeBank(){
    let cTrxKey = localStorage.getItem("TrxKey");
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers }); 
    var cBody = { 
                  TRX: this.config.GetKodeBank,  
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
        for (var i = 1; i <= 200; i++) {  
          if(res[i] !== undefined){  
            let vaProduk = res[i].split("|") ; 
            //alert(vaProduk[0]+"~"+vaProduk[1]);
            this.addDataKodeBank(vaProduk[0],vaProduk[1]) ;
          }  
        }
      }, (err) => {
      this.showToast("Failed to download some data " + err,"bottom") ;
    }) ;  
    return "";
  }

  requestAmbilDataMenu(cTrxKey){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers }); 
    //let cSIMSerial = localStorage.getItem("SIMSerial") ; 
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
    
    localStorage.setItem("masuk","1");
    // this.navCtrl.setRoot(AkunPage); 
    this.navCtrl.setRoot(HomeMenuPage); 
    this.showToast("Berhasil ambil data fitur","bottom") ;
  }

  requestAmbilDataProduk(cTrxKey){
    this.stopLoading(); // stop loading waktu proses ambil data
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
        this.showToast("Berhasil ambil data operator","bottom") ;
      }, (err) => {
      this.showToast("Failed post data " + err,"bottom") ;
    }) ; 
    return "";
  } 

  addDataKodeBank(cKode,cNama){
    let cSQL = "INSERT INTO kodebank(kode,nama) " ; 
    cSQL += "VALUES('"+cKode+"','"+cNama+"')" ;
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => console.log('insert table kodebank'))
          .catch(e => console.log("catch db kodebank"));
      })
      .catch(e => console.log("catch catch")); 
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
