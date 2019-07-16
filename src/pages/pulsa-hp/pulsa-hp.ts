import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Loading,AlertController} from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from '../../service/config' ;
import { Md5 } from 'ts-md5/dist/md5';
import { Func } from '../../service/func' ;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; 
import { isLeapYear } from 'ionic-angular/umd/util/datetime-util';
import { isNumber } from 'ionic-angular/umd/util/util';
//import { HomePage } from '../home/home';
//import { IndexPage } from '../index';

/**
 * Generated class for the TransferProsesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pulsa-hp',
  templateUrl: 'pulsa-hp.html',
})
export class PulsaHpPage {
  loading: Loading;  
  cRekening = '' ;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue    = true ;
  cError   = "" ;
  cNomor   = "" ;
  cNominal = "" ;
  nNominal = "" ;
  cNominalBaru = "";
  cTrx     = "01" ;
  data     = [] ;
  operator = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public http: Http,
              public config: Config,
              public alertCtrl: AlertController,
              public func:Func,private sqlite: SQLite) {
    //let n = 0 ;  
    let cRekeningAsal = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekeningAsal.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ;
    this.cRekening = localStorage.getItem("RekeningUtama") ; 
  }

  hiddenButton(data,index){
    let lHide = false;
    if(data.length == index){
      lHide = true;
    }
    //console.log("ono aopo gakl " + data.length + "~" + index + "~" + lHide);
    return lHide;
  }

  showData(data,index){
    let keterangan = '';
    if(data.length != index) keterangan = data[index].keterangan;
    //console.log("ono aopo gakl " + data.length + "~" + index + "~" + keterangan);
    return keterangan;
  }

  showNominal(data,index){
    let nom = '';
    if(data.length != index) nom = data[index].nominal;
    //console.log("ono aopo gakl " + data.length + "~" + index + "~" + nom);
    return nom;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulsaHpPage');
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

  validSaving(data){
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
      let isi = data.biller+"*"+data.produkid+"*"+data.jenis+"*"+data.kodeproduk+"*"+data.nominal+"*"+data.keterangan
      this.proses(isi) ;
      //console.log("data e: " + data.biller+"~"+data.produkid+"~"+data.jenis+"~"+data.kodeproduk+"~"+data.nominal+"~"+data.keterangan);
    }
  }

  proses(datapulsa) {  
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
                this.saving(data.password,datapulsa) ; 
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
 
  saving(PIN,datapulsa){    
    if(this.lTrue == true){
      this.showLoading();
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
      let options = new RequestOptions({ headers: headers });
      headers.append('Content-Type', 'application/json');

      let cPIN = Md5.hashStr(PIN) ; 
      let cTrxID = localStorage.getItem("TrxKey") + this.func.random(111111,999999) ;
      let cSIMSerial = localStorage.getItem("SIMSerial") ; 
      
      // format: {{item.biller}}*{{item.produkid}}*{{item.jenis}}*{{item.kodeproduk}}*{{item.nominal}}*{{item.keterangan}}
      // contoh data: 104~2001~01~X5~6050~XL/Axis 5k
      let vaDataPulsa = datapulsa.split("*") ; 
      
      let cNominal = this.func.pad(vaDataPulsa[4],10) + "00" ;
      this.nNominal = vaDataPulsa[4] ;

      let cKodeProduk = vaDataPulsa[3];
      let cDE48 = vaDataPulsa[0]+"*"+vaDataPulsa[1]+"*"+vaDataPulsa[2]+"*"+vaDataPulsa[3];
      var cBody = {  
                    TRX: "20",  
                    DE003: "201040",
                    DE004: cNominal,
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
      console.log("Request e pulsa : "+data); 

      this.http.post(this.config.cURL,data,options)  
      .map(res => res.json()) 
      .subscribe(res => {          
          if(res['DE039']== "13"){
            let cNamaProduk = vaDataPulsa[5];
            let cInfo = "<font size='3px'>info : " + this.func.SNow() + "<br>"  ;
            cInfo += "Rekening : " + this.cRekening + "<br>"  ; 
            cInfo += "Nomor Tujuan : " + this.cNomor + "<br>"  ;
            cInfo += "Produk : " + cNamaProduk + "<br>"  ; 
            cInfo += "Nominal : " + this.nNominal + "<br>"  ;
            cInfo += "Status : Transaksi Dalam Proses. Mohon tunggu sms konfirmasi";   
            cInfo += "</font>" ;   
            this.showAlert("Info Pulsa :",cInfo) ;
            this.addMutasi(cTrxID,cNamaProduk,cKodeProduk,this.nNominal) ;
            this.cNomor = "";
          }else{
            this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
          }
          this.stopLoading(); 
        }, (err) => {           
        this.showToast("Failed post data " + err,"bottom") ;
        this.stopLoading(); 
      }) ;   
   
    }
  }

  addMutasi(cTrxID,cNamaProduk,cKodeProduk,cNominal){   
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
                  this.cTrx+"','"+cKodeProduk+"','"+cTrxID+"','"+this.func.SNow()+"','',"+  // 1
                  "'','','',"+  // 2
                  "'','','','"+cNominal+"',"+  // 3
                  "'','"+cNominal+"','"+this.func.SNow()+"','"+this.cTrx+"','"+this.cRekening+"',"+  // 4
                  "'"+this.cNomor+"','"+cNamaProduk+"','','',"+    // 5
                  "'','','','','',"+  // 6
                  "'','','','',"+  // 7
                  "'','','Proses','')";   // 8
    
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
 
  CekPrefix() {
    let cPrefix;
    let cNomor = this.cNomor;
    let vaKode = [];
    if(cNomor.length > 6){
      cPrefix = cNomor.substring(0,4);
      this.data = [];  // hapus semua data yang ada di spinner 
      if(cPrefix !== ""){
        vaKode = this.getKodePrefix(cPrefix);
      }else{
        this.showAlert("Info:","Terjadi kesalahan saat mengambil nominal");
      } 
    }else{
      this.showAlert("Info:","Nomor tidak valid");
    }
  }

  getKodePrefix(cPrefix){
    let vaOperator = [];
    let cSQL = "SELECT * FROM operator where prefix = '"+cPrefix+"'";
    this.sqlite.create({  
      name: 'data.db',
      location: 'default' 
    })
    .then((db: SQLiteObject) => {
      db.executeSql(cSQL, {})
        .then(operator => {
          if(operator.rows.length>0) {
            for (var i = 0; i < operator.rows.length; i++) { 
              vaOperator = [operator.rows.item(i).kodeoperator,
                            operator.rows.item(i).kode];
            }
            this.loadProdukWherePrefix(vaOperator);
          }
        }) 
        .catch(e => console.log("catchdberror"));
    }) 
    .catch(e => console.log("catch"));
    return vaOperator;
  }

  loadProdukWherePrefix(vaKode){
    let cSQL = "SELECT * FROM dataproduk " + 
    "WHERE jenis = '01' AND kode = '"+vaKode[0]+"' AND kodeproduk like '"+vaKode[1]+"%' ORDER BY produkid ASC " ;
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
        // console.log("kodeproduk:"+ data.rows.item(i).kodeproduk+
        //             "~biller:"+data.rows.item(i).biller+
        //             "~produkid:"+ data.rows.item(i).produkid+
        //             "~nominal:"+ data.rows.item(i).nominal+
        //             "~keterangan:"+ data.rows.item(i).keterangan+
        //             "~jenis:"+ data.rows.item(i).jenis );
      }        
    } 
    return this.data;
  }

  pushPage() {
    this.navCtrl.push(PulsaHpPage);
  }

}