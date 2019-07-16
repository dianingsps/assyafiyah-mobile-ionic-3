import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the PaymentListrikBayarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-listrik-bayar',
  templateUrl: 'payment-listrik-bayar.html',
})
export class PaymentListrikBayarPage {
  cTitle    = 'Detail Pelanggan Pascabayar';
  cRekening = '' ; 
  cNomor    = '' ;
  cNama     = '' ;
  cNominal  = '' ;
  nNominal  = 0 ;
  cAdmin    = '' ;
  nAdmin    = 0 ;
  cPeriode  = '' ;
  cDaya     = '' ;
  cUsage    = '' ;
  cTotalBayar = '' ;
  nTotalBayar = 0 ;
  cRef    = '';
  cBlth1  = '';
  cBlth2  = '';
  cBlth3  = '';
  cBlth4  = '';
  cBulan  = '';
  cTrx    = '05';
  loading: Loading;
  data:any = {} ; 
  places: {title:string}[] = [] ;
  selectedValue: number;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,private sqlite: SQLite) { 
    //let n = 0 ; 
    let cRekening   = localStorage.getItem("RekeningNasabah") ;
    let vaRekening  = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue    = true ;
    this.cError   = "" ;
    this.cRekening= localStorage.getItem("RekeningUtama") ; 
    this.cNomor   = this.navParams.get("IDPel") ; 
    this.cNama    = this.navParams.get("Nama") ;
    this.cPeriode = this.navParams.get("Periode") ;
    this.cDaya    = this.navParams.get("Daya") ; 
    this.cUsage   = this.navParams.get("Usage") ;
    this.nNominal = this.navParams.get("Tagihan") ;
    this.cNominal = this.func.number2String(this.nNominal,2) ;
    this.nAdmin   = this.navParams.get("Admin") ;
    this.cAdmin   = this.func.number2String(this.nAdmin,2) ; 
    this.cRef     = this.navParams.get("Ref") ; 
    this.cBlth1   = this.navParams.get("Periode") == "" ? "" : this.navParams.get("Periode") ; 
    this.cBlth2   = this.navParams.get("Blth2") == "" ? "" : ", " + this.navParams.get("Blth2") ; 
    this.cBlth3   = this.navParams.get("Blth3") == "" ? "" : ", " + this.navParams.get("Blth3") ; 
    this.cBlth4   = this.navParams.get("Blth4") == "" ? "" : ", " + this.navParams.get("Blth4") ; 
    this.cBulan   = this.cBlth1 + this.cBlth2 + this.cBlth3 + this.cBlth4;
    this.nTotalBayar = parseInt(this.navParams.get("Tagihan")) + parseInt(this.navParams.get("Admin"));
    this.cTotalBayar = this.func.number2String(this.nTotalBayar,2) ; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentListrikBayarPage');
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
      this.cError += "Rekening Harap Dipilih...\n" ;
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
      let cDE48 = "0201*1002*PAYPLN*"+this.cRef;    
      var cBody = { 
                    TRX: "21",  
                    DE003: "211000", 
                    DE004: this.func.pad(this.nTotalBayar + "00",12),  
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
          if(res['DE039']== "01"){ 
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
          }else{
            this.addMutasi(cTrxID,"PAYPLN");
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
            this.dismiss();
          }
          this.stopLoading(); 
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
      }) ;
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

  addMutasi(cTrxID,cProductID){
    //let cSQL = "INSERT INTO mutasi(trx,kode,trxid,tgl,noresi,namakredit,nokontrak,nama,namapelanggan,idreff,noangsuran,jumlahtagihan,admin,total,datetime) " ;
    //cSQL += "VALUES('"+this.cTrx+"','','"+cTrxID+"','"+this.func.SNow()+"','"+this.cNomor+"','','"+this.cRekening+"','','"+this.cNama+"','','','"+this.cNominal+"','0','"+this.cNominal+"','"+this.func.SNow()+"')" ;
    
    let cSQL  = "INSERT INTO mutasi (" +          // 0
                "trx,kode,trxid,tgl,noresi,"+     // 1
                "namakredit,nokontrak,nama,"+     // 2
                "namapelanggan,idreff,noangsuran,jumlahtagihan,"+ // 3
                "admin,total,datetime,jenis,rekening,"+   // 4
                "nohp,namaproduk,idpelanggan,nometer,"+   // 5
                "daya,ref,bulan,standmeter,materai,"+     // 6
                "ppn,ppj,angsuran,stroom,"+       // 7
                "kwh,tokenlistrik,status,keterangan) ";       // 8
    
    cSQL  += "VALUES ('" +   // 0
                  this.cTrx+"','"+cProductID+"','"+cTrxID+"','"+this.func.SNow()+"','',"+  // 1
                  "'','','',"+  // 2
                  "'"+this.cNama+"','','','"+this.nNominal+"',"+  // 3
                  "'"+this.nAdmin+"','"+this.nTotalBayar+"','"+this.func.SNow()+"','"+this.cTrx+"','"+this.cRekening+"',"+  // 4
                  "'','','"+this.cNomor+"','',"+    // 5
                  "'"+this.cDaya+"','','"+this.cBulan+"','','',"+  // 6
                  "'','','','',"+  // 7
                  "'','','Proses','')";   // 8

    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then(() => this.showToast("Tunggu hingga anda menerima pesan","bottom"))
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }

}
