import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the PulsaListrikBayarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() 
@Component({
  selector: 'page-pulsa-listrik-bayar',
  templateUrl: 'pulsa-listrik-bayar.html',
})
export class PulsaListrikBayarPage {
  cTitle    = 'Detail Pelanggan Prabayar';
  cRekening = '' ;
  cMeter    = '' ; 
  cNomor    = '' ;
  cNama     = '' ;
  cDaya     = '' ;
  cNominal  = '' ;
  nNominal  = 0 ;
  cRef      = '' ;
  cTrx      = '06';
  cNomorPelanggan = '';
  loading: Loading;
  data     = [] ;
  operator = [];
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
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue      = true ;
    this.cError     = "" ; 
    this.cRekening  = localStorage.getItem("RekeningUtama") ; 
    this.cMeter     = this.navParams.get("NoMeter") ;
    this.cNomor     = this.navParams.get("IDPel") ;
    this.cNama      = this.navParams.get("Nama") ;
    this.cDaya      = this.navParams.get("Daya") ; 
    this.cRef       = this.navParams.get("Ref") ; 
    this.loadProduk(); 
  }

  ionViewDidLoad() {
    
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
      this.cError += "Rekening Harap Dipilih \n" ;
    }else if(this.cNominal == ""){
      this.lTrue = false ;
      this.cError += "Harap pilih nominal \n" ;
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
      
      if(localStorage.getItem("PakaiNomorMeter") == "1"){
        this.cNomorPelanggan = this.cMeter;
      } else { 
        this.cNomorPelanggan = this.cNomor;
      }     

      let vaProduk    = this.cNominal.split("*") ; 
      let vaNominal   = vaProduk[3].split("||") ; 
      let cKodeProduk = vaNominal[0];  
      let cNominal    = vaNominal[1]; 
      let cNamaProduk = vaNominal[2]; 

      let cDE48 = "0"+vaProduk[0]+"*"+vaProduk[1]+"*"+vaProduk[2]+"*"+cKodeProduk+"*"+this.cNomorPelanggan+"*"+this.cRef;
       
      var cBody = {  
                    TRX: "20",   
                    DE003: "201040", 
                    DE004: this.func.pad(cNominal + "00",12),  
                    DE012: this.func.getTime(),
                    DE013: this.func.getDate(), 
                    DE037: cTrxID,
                    DE039: "00",
                    DE044: "0",
                    DE048: cDE48,
                    DE052: "00000000000000000000000000000000" + cPIN,
                    DE061: cSIMSerial,
                    DE102: this.cRekening,
                    DE103: localStorage.getItem("NoHPTerdaftar")
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
          if(res['DE039'] == "01"){
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
          }else{
            this.addMutasi(cTrxID,cNamaProduk,cKodeProduk);
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
            this.dismiss();
          }
          console.log("Respon e: " + res.text) ;
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
   
  addMutasi(cTrxID,cNamaProduk,cProductID){
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
                  "'"+this.cNama+"','','','0',"+  // 3
                  "'0','0','"+this.func.SNow()+"','"+this.cTrx+"','"+this.cRekening+"',"+  // 4
                  "'','','"+this.cNomor+"','"+this.cMeter+"',"+    // 5
                  "'"+this.cDaya+"','','','','0',"+  // 6
                  "'0','0','0','0',"+  // 7
                  "'0','','Proses','')";   // 8
                   
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

  loadProduk(){
    let cSQL = "SELECT * FROM dataproduk WHERE jenis = '06' ORDER BY kodeproduk ASC " ;
    this.sqlite.create({    
      name: 'data.db',
      location: 'default' 
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})
          .then((data) => this.fetchRow(data))
          .catch(e => console.log("catchdberror"));
      })
      .catch(e => console.log("catch")); 
  }

  fetchRow(data){    
    if (data.rows.length > 0) { 
      for (var i = 0; i < data.rows.length; i++) { 
        this.data.push({kodeproduk: data.rows.item(i).kodeproduk,
                        biller: data.rows.item(i).biller,
                        produkid: data.rows.item(i).produkid,
                        nominal: data.rows.item(i).nominal,
                        keterangan: data.rows.item(i).keterangan,
                        jenis: data.rows.item(i).jenis                        
                      });
      }        
    } 
    return this.data;
  }
  
}