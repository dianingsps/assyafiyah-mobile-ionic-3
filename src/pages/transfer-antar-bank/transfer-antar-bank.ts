import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 
import { Screenshot } from '@ionic-native/screenshot';
import { FuncDatabase } from '../../service/funcdatabase' ;
import { AkunPage } from '../akun/akun';


/**
 * Generated class for the TransferAntarBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transfer-antar-bank',
  templateUrl: 'transfer-antar-bank.html',
})
export class TransferAntarBankPage {

  loading: Loading;  
  cRekeningAsal = '' ;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue     = true ;
  cError    = "" ;
  cNama     = "" ;
  cNominal  = "" ;
  cBerita   = "" ;
  cTrx      = "12";
  cRekeningTujuan = "" ;
  cNamaTujuan = "" ;
  cRekeningBank = "";
  cBankTujuan = "";
  cKodeBankTujuan = "";
  cNamaBankTujuan = "";
  nBiayaAdmin = "0";
  data : Array<{ kode: string, nama: string }> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              private screenshot : Screenshot,
              public func:Func,
              public funcdatabase:FuncDatabase,
              private sqlite: SQLite) {
    //let n = 0 ;  
    let cRekeningAsal = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekeningAsal.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    } 
    this.lTrue = true ;
    this.cError = "" ;
    this.cRekeningAsal    = localStorage.getItem("RekeningUtama") ; 
    this.cRekeningTujuan  = this.navParams.get("Rekening") ;
    this.cNama            = this.navParams.get("Nama") ;

    this.requestAmbilDataKodeBank();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferAntarBank');
    //this.funcdatabase.initDelDBKodeBank(); 
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

  showLoading(cPesan) {
    this.loading = this.loadingCtrl.create({
      content: cPesan,
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }
 
  stopLoading(){
    this.loading.dismiss() ;
  }

  validSaving(){
    this.cError = "" ;
    if(this.cRekeningAsal == ""){
      this.lTrue = false ;
      this.cError += "Rekening Asal Harap Diisi...\n" ;
    }else if(this.cRekeningTujuan == "" || this.cRekeningTujuan == null){
      this.lTrue = false ;
      this.cError += "Rekening Tujuan Harap Diisi...\n" ;
    }else if(this.cNominal == ""){
      this.lTrue = false ;
      this.cError += "Nominal Tidak Boleh Nol ...\n" ;
    }else if(parseInt(this.cNominal) < 10000){  
      this.lTrue = false ;
      this.cError += "Maaf, nilai minimal kirim uang adalah Rp. 10,000 ...\n" ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    } 
 
    if(this.cError !== ""){
      this.showAlert("Perhatian :",this.cError) ;
    }else{
      this.getBiayaAdminTransfer();
    }
  }
 
  saving(PIN){   
    if(this.lTrue == true){
      this.showLoading("Memproses transaksi...");
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let pecahkodebank = this.cBankTujuan.split("|");
      this.cKodeBankTujuan = pecahkodebank[0];
      this.cNamaBankTujuan = pecahkodebank[1];
      let cPIN = Md5.hashStr(PIN) ; 
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      let cNominal = this.func.pad(parseInt(this.cNominal),10) + "00" ;
      var cBody = { 
                    TRX: "11",  
                    DE003: "111000",
                    DE004: cNominal,
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: this.cRekeningAsal+"|"+this.cRekeningTujuan+"|"+this.cKodeBankTujuan+"|"+this.cBerita+"|"+this.cNominal+"|"+this.cNamaTujuan, 
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekeningAsal,
                    DE103: this.cRekeningBank
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
            this.showInfo(res['DE048']);
            this.addMutasi(cTrxID) ;
            //this.dismiss() ;  
          }else if(res['DE039']== "15"){ // trx melebihi limit
            this.showAlert("Pesan :",res['DE048']);
          }else{
            let cKode = this.func.getRC(res['DE039']);
            this.showAlert("Pesan :",cKode) ;
          }
          console.log("respon e sam " + res.text);
          this.stopLoading(); 
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
      }) ;   
   
    }
  }

  getBiayaAdminTransfer(){
    this.showLoading("Tunggu sebentar. Memuat informasi...");
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');

    let pecahkodebank = this.cBankTujuan.split("|");
    this.cKodeBankTujuan = pecahkodebank[0];
    let cNominal = this.func.pad(parseInt(this.cNominal),10) + "00" ;
    let cSIMSerial = localStorage.getItem("SIMSerial") ; 
    var cBody = { 
                  TRX: "15",  
                  DE003: "151000",
                  DE004: cNominal,
                  DE012: this.func.getTime(), 
                  DE013: this.func.getDate(),
                  DE037: "000000000000",
                  DE039: "00", 
                  DE044: "0",
                  DE048: this.cKodeBankTujuan,
                  DE052: "00000000000000000000000000000000" + "00000000000000000000000000000000",
                  DE061: cSIMSerial,
                  DE102: "", 
                  DE103: ""
                }   
    var cRequest = {
                  MTI: "002",
                  MSG: cBody
                  } 
    let data = "cCode="+JSON.stringify(cRequest) ;
    console.log("Request get biaya admin: "+data); 
    this.http.post(this.config.cURL,data,options)  
    .map(res => res.json())     
    .subscribe(res => {           
        this.stopLoading();  
        if(res['DE039']== "00"){
          let nAdmin = res['DE048'];
          let cPesan = "Biaya admin untuk transaksi ini adalah: Rp. " + nAdmin + "<br>";
          cPesan += "Proses sekarang?";
          this.confirmProcess(cPesan) ;
        }else{
          this.proses();
        }        
      }, (err) => {           
      this.showToast("Failed post data " + err,"bottom") ;
      this.stopLoading();  
    }) ;
  }

  confirmProcess(cPesan) {
    let alert = this.alertCtrl.create({
      title: 'Info',
      message: cPesan,
      buttons: [
        {
          text: 'Kembali',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Proses',
          handler: () => {
            this.proses();
          }
        }
      ]
    });
    alert.present();
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

  addMutasi(cTrxID){   
    let cKeterangan = this.cKodeBankTujuan + "#" + this.cNamaBankTujuan + "#" + this.cBerita  ;
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
                  this.cTrx+"','','"+cTrxID+"','"+this.func.SNow()+"','',"+  // 1
                  "'','','"+this.cNamaTujuan+"',"+  // 2
                  "'','','','',"+  // 3
                  "'','"+this.cNominal+"','"+this.func.SNow()+"','','"+this.cRekeningAsal+"',"+  // 4
                  "'','','"+this.cRekeningTujuan+"','',"+    // 5
                  "'','','','','',"+  // 6
                  "'','','','',"+  // 7
                  "'','','Proses','"+cKeterangan+"')";   // 8
    
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

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  showInfo(detail){
    let vaInfo = detail.split("|") ;  
    let cInfo = "<font color = 'black' size='3px'>Tgl : " + this.func.SNow() + "<br>"  ;
        cInfo += "Rek. Asal : " + this.cRekeningAsal + "<br>"  ;
        cInfo += "Kode Bank : " + this.cKodeBankTujuan + "-" + this.cNamaBankTujuan + "<br>" ;
        cInfo += "Rek. Tujuan : " + this.cRekeningTujuan + "<br>"  ;
        cInfo += "Atas Nama : " + this.cNamaTujuan + "<br>"  ;
        cInfo += "Nominal : Rp. " + this.func.number2String(this.cNominal,2) + "<br>"  ;
        cInfo += "Biaya Admin : Rp. " + vaInfo[1] + "<br>"  ;
        cInfo += "Ket : " + this.cBerita + "<br>"  ; 
        cInfo += "Status : Sukses" + "<br>"  ; 
        cInfo += "Ket Status : " + vaInfo[0]; 
        cInfo += "</font>" ;  
    let dt = this.func.SNow().replace(' ','_'); 
    dt     = dt.replace('-','');

    let confirm = this.alertCtrl.create({
      title: 'Detail',
      message: cInfo,
      buttons: [
        {
          text: 'Simpan',
          handler: () => {
            this.screenshot.save('jpg', 95, 'TRF'+dt)
              .then(() => this.suksesCapture())
              .catch(e => alert("Gagal scerenshot"))
          }
        },
        {
          text: 'Kembali',
          handler: () => {this.navCtrl.setRoot(AkunPage);}
        }
      ]
    });
    confirm.present();
  }

  suksesCapture(){
    this.showAlert("Info","Hasil capture disimpan di folder '/Pictures'");
    this.navCtrl.setRoot(AkunPage);
  }

  requestAmbilDataKodeBank(){
    this.funcdatabase.initDelDBKodeBank();
    this.showLoading("Memuat data..."); 
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
        this.getBankTujuan(); 
        this.stopLoading();
      }, (err) => {
      this.showToast("Failed to download some data " + err,"bottom") ;
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

  getBankTujuan(){  
    let cSQL = "SELECT * FROM kodebank" ;
    this.sqlite.create({  
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {}) //this.fetchRow(data)
          .then((data) => this.fetchRow(data))
          .catch(e => console.log("catch getkodebank"));
      })
      .catch(e => console.log("catcherr bank")); 
  } 

  fetchRow(data){   
    //console.log(data); 
    if (data.rows.length > 0) { 
      for (var i = 0; i < data.rows.length; i++) { 
        this.data.push({
                        kode:data.rows.item(i).kode,
                        nama:data.rows.item(i).nama,
                      });
      }        
    } 
    return this.data;
    
  }

}