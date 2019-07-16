import { TransferProsesPage } from './../transfer-proses/transfer-proses';
//import { AkunPage } from './../akun/akun';
//import { TransferPage } from './../transfer/transfer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController,ViewController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
//import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular/util/events';


@IonicPage()
@Component({
  selector: 'page-transfer-daftar',
  templateUrl: 'transfer-daftar.html',
})
export class TransferDaftarPage {
  loading: Loading;
  data:any = {} ; 
  cRekening = '' ;
  lTrue = true ;
  cError = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public events: Events,
              public func:Func,private sqlite: SQLite) { 
    //let n = 0 ; 
    this.lTrue = true ;
    this.cError = "" ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferDaftarPage');
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
      content: 'Tunggu sebentar...',
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

  saving(){   
    this.validSaving() ; 
    if(this.lTrue == true){
      this.showLoading();
      
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ;  
      var cBody = { 
                    TRX: "06",  
                    DE003: "061000",
                    DE004: "000000000000",
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0", 
                    DE048: "", 
                    DE052: "00000000000000000000000000000000" + "00000000000000000000000000000000",
                    DE061: cSIMSerial,
                    DE102: "",
                    DE103: this.cRekening             
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
              this.tambahkan(res['DE103'],res['DE048']) ;
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

  tambahkan(cRekening,cNama){  
    let cInfo = "<font size='4px'>Rekening : " + cRekening + "<br>" ;
    cInfo += "Info : " + cNama + "</font>" ;
    let confirm = this.alertCtrl.create({
      title: 'Data Rekening',
      message: cInfo,
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            console.log('Batal clicked');
          }
        },
        {
          text: 'Tambahkan',
          handler: () => {
            this.addData(cRekening,cNama) ;
          }
        }
      ]
    });
    confirm.present();
  }

  addData(cRekening,cNama){
    this.showLoading() ; 
    let cSQL = "SELECT * FROM transfer_rekening WHERE rekening = '"+cRekening+"'" ;
    this.sqlite.create({    
      name: 'data.db',
      location: 'default' 
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then((data) => this.CekAdaTidak(data,cRekening,cNama))
          .catch(e => console.log("catchdberror"));
      })
      .catch(e => console.log("catch")); 
  }

  CekAdaTidak(data,cRekening,cNama){    
    let cSQL = "";
    if (data.rows.length == 0) { 
      cSQL = "INSERT INTO transfer_rekening(rekening,nama,datetime) VALUES ('"+cRekening+"','"+cNama+"','"+this.func.SNow()+"')";
    }else{
      cSQL = "UPDATE transfer_rekening SET rekening = '"+cRekening+"', nama = '"+cNama+"', datetime = '"+this.func.SNow()+"' where rekening = '"+cRekening+"'" ;
    }
    this.sqlite.create({    
      name: 'data.db', 
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql(cSQL, {}) 
        .then(() => this.pushPage(cRekening,cNama))       
        .catch(e => this.showToast("Gagal menambahkan ekening","bottom"));
    })
    .catch(e => this.showToast("Ada Kesalahan di aplikasi","bottom")); 
    this.stopLoading();
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  dismiss(){
    this.navCtrl.pop() ;
  }

  pushPage(cRekening,cNama) {
    let profileModal = this.modalCtrl.create(TransferProsesPage,{
      'Rekening' : cRekening,
      'Nama':cNama
    });
    this.events.publish('rekening:tambah');
    profileModal.present();
    this.showToast("Berhasil menambahkan ke daftar rekening","bottom");
  }

}
