import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-payment-cicilan-bayar',
  templateUrl: 'payment-cicilan-bayar.html',
})
export class PaymentCicilanBayarPage { 
  cRekening = '' ; 
  cTitle = '' ;
  cNomor = '' ;
  cNama = '' ;
  cPerusahaan = '' ;
  cBranch = '' ;
  cPlat = '' ;
  cMerk = '' ;
  cTenor = '' ;
  cKe = '' ;
  cNominal = '' ;
  cAdmin = '' ;
  cTotalBayar = 0 ;
  cIDReff = '';
  cTrx = '11';
  cJthTmp = '';
  loading: Loading;
  data:any = {} ; 
  cFinance = '' ;
  places: {title:string}[] = [] ;
  selectedValue: number;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;
  vaData = [];

  // lhide
  lCabang     = true;
  lPlatNomor  = true;
  lIDReff     = true;
  lMerk       = true;
  lJthTmp     = true;
  lTenor      = true;
  lKe         = true;
  lNominal    = true;
  lAdmin      = true;
  lTipeMotor  = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,private sqlite: SQLite) { 
    //let n = 0 ; 
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ;
    this.vaData = this.navParams.get("Data") ;
    this.cRekening  = localStorage.getItem("RekeningUtama") ; 
    this.cFinance   = this.vaData[4] ; 
    this.cTitle     = this.vaData[4] ; 
    this.cNomor     = this.vaData[5] ; 
    this.cNama      = this.vaData[6] ; 
    this.cPerusahaan = this.vaData[4]; 
    this.cBranch    = this.vaData[1] ; 
    this.cPlat      = this.vaData[7] ;    
    this.cIDReff    = this.vaData[3] ; 
    this.cTenor     = this.vaData[10] + " bulan" ; 
    this.cKe        = this.vaData[8] ; 
    this.cJthTmp    = this.vaData[9] ; 
    this.cNominal   = this.vaData[13] ; 
    this.cAdmin     = this.vaData[11] ; 
    this.cTotalBayar = parseInt(this.cNominal) + parseInt(this.cAdmin) ;  
    
    if(this.vaData[1] == "FNCLMB"){
      this.lIDReff = false;
      this.lKe     = false;
      this.lJthTmp = false;
      this.lTenor  = false;
      this.lNominal= false;
      this.lAdmin  = false;
    }else if(this.vaData[1] == "FNMEGA" || this.vaData[1] == "FNMAF"){

    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentCicilanBayarPage');
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
    if(this.cRekening == ""){
      this.lTrue = false ;
      this.cError += "Rekening Harap Diisi...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    } 
 
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      this.proses() ;
    }
  }


  proses() {  
    let alert = this.alertCtrl.create({
      title: 'Masukkan PIN :',
      inputs: [
        {
          name: 'password',
          placeholder: 'PIN',
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
            if(data.password !== ""){
              if(data.password.length == '6'){
                this.saving(data.password) ; 
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
 
  saving(PIN){    
    if(this.lTrue == true){
      this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');
      let cPIN = Md5.hashStr(PIN) ;
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let cDE48 = "0502*1002*PAYFINANCE~~" + this.cFinance + "~~" + this.cIDReff ;    
      var cBody = { 
                    TRX: "21",  
                    DE003: "211000",
                    DE004: this.func.pad(this.cTotalBayar + "00",12),  
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cDE48,  
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekening,
                    DE103: this.cNomor
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
            alert("ok") ;
          }else{
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
          }
          this.stopLoading(); 
          this.dismiss();
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
      }) ;    

      let cSQL = "INSERT INTO mutasi(trx,kode,trxid,tgl,noresi,namakredit,nokontrak,nama,namapelanggan,idreff,noangsuran,jumlahtagihan,admin,total,datetime) " ;
      cSQL += "VALUES('"+this.cTrx+"','"+this.cFinance+"','"+cTrxID+"','"+this.func.SNow()+"','"+cTrxID+"','"+this.cPerusahaan+"','"+this.cNomor+"','"+this.cNama+"','','"+cTrxID+"','"+this.cKe+"','"+this.cNominal+"','"+this.cAdmin+"','"+this.cTotalBayar+"','"+this.func.SNow()+"')" ;
      this.sqlite.create({    
        name: 'data.db', 
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql(cSQL, {})
            .then(() => console.log('insert table mutasi'))
            .catch(e => console.log("catch db"));
        })
        .catch(e => console.log("catch")); 
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

  dismiss(){
    this.navCtrl.pop() ;
  }
}
