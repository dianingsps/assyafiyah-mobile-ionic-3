import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 
import { Screenshot } from '@ionic-native/screenshot';

/**
 * Generated class for the TransferProsesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transfer-proses',
  templateUrl: 'transfer-proses.html',
})
export class TransferProsesPage {
  loading: Loading;  
  cRekeningAsal = '' ;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue     = true ;
  cError    = "" ;
  cNama     = "" ;
  cNominal  = "" ;
  cBerita   = "" ;
  cTrx      = "02";
  cRekeningTujuan = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              private screenshot : Screenshot,
              public func:Func,private sqlite: SQLite) {
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferProsesPage');
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
    if(this.cRekeningAsal == ""){
      this.lTrue = false ;
      this.cError += "Rekening Asal Harap Diisi...\n" ;
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
      let cNominal = this.func.pad(parseInt(this.cNominal),10) + "00" ;
      var cBody = { 
                    TRX: "03",  
                    DE003: "031000",
                    DE004: cNominal,
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(),
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: this.cBerita, 
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekeningAsal,
                    DE103: this.cRekeningTujuan
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
              this.dismiss() ;
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

  addMutasi(cTrxID){   
    let cKeterangan = "Kirim uang ke Rek. " + this.cRekeningTujuan + " a.n "+this.cNama+": " + this.cBerita  ;
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
                  "'','','',"+  // 2
                  "'"+this.cNama+"','','','',"+  // 3
                  "'','"+this.cNominal+"','"+this.func.SNow()+"','"+this.cTrx+"','"+this.cRekeningAsal+"',"+  // 4
                  "'','','"+this.cRekeningTujuan+"','',"+    // 5
                  "'','','','','',"+  // 6
                  "'','','','',"+  // 7
                  "'','','Berhasil','"+cKeterangan+"')";   // 8
    
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
        cInfo += "Rek. Tujuan : " + this.cRekeningTujuan + "<br>"  ;
        cInfo += "Nama : " + vaInfo[0] + "<br>"  ; 
        cInfo += "Nominal : Rp. " + this.func.number2String(this.cNominal,2) + "<br>"  ;
        cInfo += "Ket : " + this.cBerita + "<br>"  ; 
        cInfo += "Status : Sukses"  ; 
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
              .catch(e => alert("Gagal capture"))
          }
        },
        {
          text: 'Kembali',
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  suksesCapture(){
    this.showAlert("Info","Hasil capture disimpan di folder '/Pictures'");
  }

}
