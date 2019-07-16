import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController,ModalController,LoadingController,Loading} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Func } from '../../service/func' ;
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../service/config' ;

/**
 * Generated class for the RiwayatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat',
  templateUrl: 'riwayat.html',
})
export class RiwayatPage {
  items = [];
  database: SQLiteObject; 
  data = [] ;
  n = 0 ;
  nLimit1 = 0 ;
  nLimit2 = 50 ;   
  nBatas  = 5 ; 
  loading: Loading;
  colorIcon : string = '#3d9aff'; //blue
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl:AlertController,public modalCtrl: ModalController,
              private sqlite: SQLite, public loadingCtrl: LoadingController,
              public func:Func,
              public http: Http,
              public config: Config) {
    this.doing(this.nLimit1,this.nLimit2) ;     
  } 

  ionViewDidLoad() { 
    console.log('ionViewDidLoad RiwayatPage');
  }

  doInfinite(infiniteScroll) { 
    setTimeout(() => {
      ++this.n ; 
      this.nLimit1 = this.n * this.nBatas ;
      this.doing(this.nLimit1,this.nLimit2) ; 
      infiniteScroll.complete();
    }, 1000);
  }

  doing(nLimit1,nLimit2){  
    let cSQL = "SELECT * FROM mutasi ORDER BY datetime DESC limit "+nLimit1+","+nLimit2 ;
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
        var past = new Date(data.rows.item(i).datetime).getTime();
        var now = new Date().getTime() ; 
        var selisih = now-past ;
        var time = this.func.timeElapsed(selisih); 
        var TRX = data.rows.item(i).trx ;
        let icons = "checkbox" ;
        let jenistr = "";
        let nopelangganperproduk = "";
        if(TRX == "11"){
          icons = "card" ;
          jenistr = "Finance"; 
          nopelangganperproduk = data.rows.item(i).nokontrak;
        }else if(TRX == "01"){
          icons = "phone-portrait" ;
          jenistr = "Pulsa HP : " + data.rows.item(i).namaproduk;
          nopelangganperproduk = data.rows.item(i).nohp;
        }else if(TRX == "06"){ 
          icons = "flash" ;
          jenistr = "PLN Prabayar";
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        }else if(TRX == "05"){
          jenistr = "PLN Pascabayar";
          icons = "thunderstorm" ;
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        }else if(TRX == "PDAM"){
          icons = "water" ;
          jenistr = "PDAM";
        }else if(TRX == "09"){ 
          icons = "call" ;
          jenistr = "Telepon";
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        }else if(TRX == "03"){
          icons = "medkit" ; 
          jenistr = "BPJS";
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        }else if(TRX == "02"){
          icons = "send" ;
          jenistr = "Kirim Uang";
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        }else if(TRX == "12"){
          icons = "send" ;
          jenistr = "Kirim Uang Antar Bank";
          nopelangganperproduk = data.rows.item(i).idpelanggan;
        } 
        this.data.push({
                        trx:data.rows.item(i).trx,
                        kode:data.rows.item(i).kode,
                        trxid: data.rows.item(i).trxid,
                        tgl: data.rows.item(i).tgl, 
                        noresi: data.rows.item(i).noresi, 
                        namakredit: data.rows.item(i).namakredit,
                        nokontrak: data.rows.item(i).nokontrak,
                        nama: data.rows.item(i).nama,
                        namapelanggan: data.rows.item(i).namapelanggan,
                        idreff: data.rows.item(i).idreff,
                        noangsuran: data.rows.item(i).noangsuran,
                        jumlahtagihan: data.rows.item(i).jumlahtagihan,
                        admin: data.rows.item(i).admin, 
                        total: data.rows.item(i).total,
                        datetime: time,
                        jenis: data.rows.item(i).jenis,
                        rekening: data.rows.item(i).rekening,
                        nohp: data.rows.item(i).nohp,
                        namaproduk: data.rows.item(i).namaproduk,
                        idpelanggan: data.rows.item(i).idpelanggan,
                        nometer: data.rows.item(i).nometer,
                        daya: data.rows.item(i).daya,
                        ref: data.rows.item(i).ref,
                        bulan: data.rows.item(i).bulan,
                        standmeter: data.rows.item(i).standmeter,
                        materai: data.rows.item(i).materai,
                        ppn: data.rows.item(i).ppn,
                        ppj: data.rows.item(i).ppj,
                        angsuran: data.rows.item(i).angsuran,
                        stroom: data.rows.item(i).stroom,
                        kwh: data.rows.item(i).kwh,
                        tokenlistrik: data.rows.item(i).tokenlistrik,
                        status: data.rows.item(i).status,
                        icon:icons,
                        jenistr:jenistr,
                        nopelangganperproduk:nopelangganperproduk,
                        keterangan:data.rows.item(i).keterangan
                      });
      }        
    } 
    return this.data;
    
  }

  public showAlert(msg:string,title:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
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
  
  //pulsa
  funcTRX01(va){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');    
    var cBody = { 
                  TRX: this.config.GetTrx,  
                  Tgl: va.tgl,
                  Kode : va.kode,
                  IDPel : va.nohp
                }

    var cRequest = {  
                  MTI: "004",
                  MSG: cBody
                  }

    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : " + data);
 
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json())  
    .subscribe(res => {  
      let data = res[0].split("|"); 
      console.log("req-> ",data);
      this.funcTRX01Proses(va,data);
      }, (err) => {           
      alert(err) ;
    }) ;   
  }

  //bpjs kesehatan
  funcTRX03(va){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');    
    var cBody = { 
                  TRX: this.config.GetTrx,  
                  Tgl: va.tgl,
                  Kode : va.kode,
                  IDPel : va.idpelanggan,
                  TrxID : va.trxid
                }

    var cRequest = {  
                  MTI: "004",
                  MSG: cBody
                  }

    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : " + data);
 
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json())  
    .subscribe(res => {  
      let data = res[0].split("|"); 
      console.log("req-> ",data);
      this.funcTRX03Proses(va,data);
      }, (err) => {
      alert(err) ;
    }) ;   
  }

  //pascapln
  funcTRX05(va){
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');    
    var cBody = { 
                  TRX: this.config.GetTrx,  
                  Tgl: va.tgl,
                  Kode : va.kode,
                  IDPel : va.idpelanggan
                }

    var cRequest = {  
                  MTI: "004",
                  MSG: cBody
                  }

    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : " + data);
 
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json())  
    .subscribe(res => {  
      let data = res[0].split("|"); 
      console.log("req-> ",data);
      this.funcTRX05Proses(va,data);
      }, (err) => {
      alert(err) ;
    }) ;   
  }

  //pralistrik
  funcTRX06(va){     
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');
    var cBody = { 
                  TRX: this.config.GetTrx,  
                  Tgl: va.tgl,
                  Kode : va.kode,
                  IDPel : va.idpelanggan
                } 
                
    var cRequest = {  
                  MTI: "004",
                  MSG: cBody
                  }

    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : " + data);
 
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json())  
    .subscribe(res => {  
      let data = res[0].split("|"); 
      console.log("res-> ",data);
    
      this.funcTRX06Proses(va,data);
      }, (err) => {           
      alert(err) ;
    }) ;   
  }

  //finance
  funcTRX11(cTRX,va){     
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
    let options = new RequestOptions({ headers: headers });
    headers.append('Content-Type', 'application/json');    
    var cBody = { 
                  TRX: this.config.GetTrx,  
                  Tgl: va.tgl,
                  Kode : cTRX,
                  IDPel : va.nokontrak
                }

    var cRequest = {  
                  MTI: "004",
                  MSG: cBody
                  }

    let data = "cCode="+JSON.stringify(cRequest) ;    
    console.log("Request e : " + data);
 
    this.http.post(this.config.cURLProduk,data,options)  
    .map(res => res.json())  
    .subscribe(res => {  
      let data = res[0].split("|"); 
      console.log("req-> ",data);
      this.funcTRX11Proses(va,data);
      }, (err) => {           
      alert(err) ;
    }) ;   
  }

//teleponpasca
funcTRX09(va){
  let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
  let options = new RequestOptions({ headers: headers });
  headers.append('Content-Type', 'application/json');
  var cBody = { 
                TRX: this.config.GetTrx,  
                Tgl: va.tgl,
                Kode : va.kode,
                IDPel : va.idpelanggan
              }

  var cRequest = {  
                MTI: "004",
                MSG: cBody
                }

  let data = "cCode="+JSON.stringify(cRequest) ;    
  console.log("Request e : " + data);

  this.http.post(this.config.cURLProduk,data,options)
  .map(res => res.json())  
  .subscribe(res => {  
    let data = res[0].split("|"); 
    console.log("respon e : " + data);
    this.funcTRX09Proses(va,data);
    }, (err) => {           
    alert(err) ;
  }) ;   
}

//cektransferantarbank
funcTRX12(va){
  this.showLoading();
  let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'}); 
  let options = new RequestOptions({ headers: headers });
  headers.append('Content-Type', 'application/json');
  let cSIMSerial = localStorage.getItem("SIMSerial") ; 
  var cBody = { 
                TRX: "12",  
                DE003: "121000",
                DE004: "0",
                DE012: this.func.getTime(),
                DE013: this.func.getDate(),
                DE037: va.trxid,
                DE039: "00",
                DE044: "0",
                DE048: "", 
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
  console.log("Request e : " + data);

  this.http.post(this.config.cURLProduk,data,options)  
  .map(res => res.json()) 
  .subscribe(res => {          
      if(res['DE039']== "00"){
        //console.log(res['DE048']);
        this.funcTRX12Proses(va,res['DE048'])

      }else{
        this.showAlert("Pesan :",this.func.getRC(res['DE039'])) ;
      }
      this.stopLoading(); 
    }, (err) => {           
    //this.showToast("Failed post data " + err,"bottom") ;
    this.stopLoading(); 
  }) ;   
}

  detail(va){
    let profileModal;
    let cPage = "";
    let cTRX = va.trx ;
    if(cTRX == "01"){
      cPage = "RiwayatDetailPulsaPraPage";
      if(va.status == "Proses" ){
        this.funcTRX01(va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Tgl"       : va.tgl,
          "Jenis"     : "Pulsa Prabayar",
          "Rekening"  : va.rekening,
          "NoHP"      : va.nohp,
          "Nominal"   : va.total,
          "Harga"     : "Rp. " + va.jumlahtagihan,
          "SN"        : va.sn,
          "Status"    : va.status,
          "TrxID"     : va.trxid,
          "Kode"      : va.kode
        }); 
        profileModal.present(va);
      }     
    }else if(cTRX == "02"){
      cPage = "RiwayatDetailTransferPage";  
      profileModal = this.modalCtrl.create(cPage,{
        'Tgl'           : va.tgl,
        'Jenis'         : "Kirim Uang",
        'Rekening'      : va.rekening,
        'RekeningTujuan': va.idpelanggan,
        'Nama'          : va.namapelanggan,
        'Keterangan'    : va.keterangan,
        "Nominal"       : va.total,        
        "Status"        : va.status 
      }); 
      profileModal.present(va);
    }else if(cTRX == "03"){
      cPage = "RiwayatDetailBpjsPage";
      if(va.status == "Proses"){
        this.funcTRX03(va);
        console.log("asem1"); 
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Tgl"         : va.tgl,
          'Jenis'       : "BPJS Kesehatan",
          'Rekening'    : va.rekening,
          'IDPel'       : va.idpelanggan,
          'Nama'        : va.namapelanggan,
          "Ref"         : va.ref,
          "Bulan"       : va.bulan,
          "Admin"       : va.admin,
          "Tagihan"     : va.jumlahtagihan,
          "Total"       : va.total,        
          "Status"      : va.status,  
          "TrxID"       : va.trxid
        }); 
        console.log("asem2");
        profileModal.present(va);
      }
    }else if(cTRX == "05"){
      cPage = "RiwayatDetailPlnPascaPage";
      if(va.status == "Proses" ){
        this.funcTRX05(va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Tgl"         : va.tgl,
          'Jenis'       : "PLN Pascabayar",
          'Rekening'    : va.rekening,
          'IDPel'       : va.idpelanggan,
          'Nama'        : va.namapelanggan,
          'Daya'        : va.daya + "VA",
          "Ref"         : va.ref,
          "Bulan"       : va.bulan,
          "StandMeter"  : va.standmeter,
          "Admin"       : va.admin,
          "Tagihan"     : va.jumlahtagihan,
          "Total"       : va.total,        
          "Status"      : va.status,  
          "TrxID"       : va.trxid
        }); 
        profileModal.present(va);
      }     
    }else if(cTRX == "06"){
      cPage = "RiwayatDetailPlnPraPage"; 
      if(va.status == "Proses" ){
        this.funcTRX06(va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Rekening"  : va.rekening, 
          "Tgl"       : va.tgl,
          "Meter"     : va.nometer,
          "Nomor"     : va.idpelanggan,
          "Nama"      : va.namapelanggan,
          "Daya"      : va.daya + "VA" , 
          "Ket"       : va.keterangan,
          "Kode"      : va.kode,
          "NoRef2"    : va.ref,
          "BiayaAdmin" : va.admin,
          "Materai"    : va.materai,
          "PPn"        : va.ppn,
          "PPj"        : va.ppj,
          "Angsuran"   : va.angsuran,
          "Stroom"     : va.stroom,
          "KWH"        : va.kwh,
          "Token"      : va.tokenlistrik,
          "TotalBayar" : va.total,
          "TrxID"      : va.trxid,
          "Status"     : va.status,
          "Message"    : ""
        }); 
        profileModal.present(va);
      }
    }else if(cTRX == "09" || cTRX == "10"){
      cPage = "RiwayatDetailTeleponPage";    
      if(va.status == "Proses" ){
        this.funcTRX09(va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Tgl"         : va.tgl,
          'Jenis'       : "Telepon Pascabayar",
          'Rekening'    : va.rekening,
          'IDPel'       : va.idpelanggan,
          'Nama'        : va.namapelanggan,
          "Ref"         : va.ref,
          "Resi"        : va.noresi,
          "Bulan"       : va.bulan,
          "Admin"       : va.admin,
          "Tagihan"     : va.jumlahtagihan,
          "Total"       : va.total,        
          "Status"      : va.status,  
          "TrxID"       : va.trxid
        }); 
        profileModal.present(va);
      }
    }else if(cTRX == "11"){
      cPage = "RiwayatDetailFinancePage";
      if(va.status == "Proses" ){
        this.funcTRX11(cTRX,va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          'Tgl'         : va.tgl,
          'NoResi'      : va.noresi,
          'Rekening'    : va.rekening,
          'NamaKredit'  : va.namakredit,
          'IDPel'       : va.nokontrak, 
          'NamaPelanggan': va.nama,
          'IDReff'      : va.idreff,
          'NoAngsuran'  : va.noangsuran,
          'Tagihan'     : va.jumlahtagihan,
          'Admin'       : va.admin,
          'TotalTagihan': va.total, 
          'Status'      : va.status
        }); 
        profileModal.present(va);
      }     
    }else if(cTRX == "12"){  
      cPage = "RiwayatDetailTransferAntarbankPage";
      if(va.status == "Proses" ){
        this.funcTRX12(va);
      }else{
        profileModal = this.modalCtrl.create(cPage,{
          "Tgl"           : va.tgl,
          "Jenis"         : "Kirim Uang Antar Bank",
          "Rekening"      : va.rekening,
          "RekeningTujuan": va.idpelanggan,
          "Total"         : va.total,        
          "Status"        : va.status,  
          "TrxID"         : va.trxid,
          "Keterangan"    : va.keterangan
        }); 
        profileModal.present(va);
      }     
    }
    
  }
  

  funcTRX01Proses(va,vaData){
    let allData = {
      "Tgl"       : va['tgl'],
      "Jenis"     : "Pulsa Prabayar",
      "Rekening"  : va['rekening'],
      "NoHP"      : va['nohp'], //idpel
      "Nominal"   : va['namaproduk'], 
      "Harga"     : "Rp. " + va['jumlahtagihan'],
      "SN"        : vaData[1],
      "Status"    : vaData[0],
      "TrxID"     : vaData[3],
      "Kode"      : va['kode']
    }

    let cSN = vaData[1];
    let cStatus = vaData[0];
    let cTrxID =  vaData[3];

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }

    console.log(cTrxID);
    console.log(allData);
    let profileModal, cPage;
    cPage = "RiwayatDetailPulsaPraPage"; 
    profileModal = this.modalCtrl.create(cPage,{getItem:allData}); 

    let cSQL  = "update mutasi set " +  
    "ref = '"+cSN+"', status = '"+cStatus+"'" +
    "where trxid = '"+cTrxID+"'";

    // update to mutasi
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }
  
  funcTRX03Proses(va,vaData){
    let allData = {
      "Tgl"         : va.tgl,
      'Jenis'       : "BPJS Kesehatan",
      'Rekening'    : va.rekening,
      'IDPel'       : va.idpelanggan,
      'Nama'        : va.namapelanggan,
      'Periode'     : va.bulan,
      "Ref"         : vaData[1],
      "Admin"       : va.admin,
      "Tagihan"     : va.jumlahtagihan,
      "Total"       : va.total,        
      "Status"      : vaData[0],  
      "TrxID"       : va.trxid,
      "Resi"        : va.noresi,
      "JmlPeserta"  : va.keterangan,
      "NoHP"        : va.nohp,
      "Bulan"       : va.bulan
    }

    let cTrxID      = va.trxid;
    let cStatus     = vaData[0];
    let nNoRef      = vaData[1];

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }

    let profileModal, cPage;
    cPage = "RiwayatDetailBpjsPage"; //{getItem:data}
    profileModal = this.modalCtrl.create(cPage,{getItem:allData});  

    let cSQL  = "update mutasi set " +  
                "status = '"+cStatus+"', ref = '"+nNoRef+"' " + 
                "where trxid = '"+cTrxID+"'";
                
     // update to mutasi
     this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db bpjs"));
      })
      .catch(e => console.log("catch"));
  }
 
  funcTRX05Proses(va,vaData){
    let allData = {
      "Tgl"         : va.tgl,
      'Jenis'       : "PLN Pascabayar",
      'Rekening'    : va.rekening,
      'IDPel'       : va.idpelanggan,
      'Nama'        : va.namapelanggan,
      'Daya'        : va.daya + "VA",
      "Ref"         : vaData[0],
      "Bulan"       : va.bulan,
      "StandMeter"  : vaData[1],
      "Admin"       : va.admin,
      "Tagihan"     : va.jumlahtagihan,
      "Total"       : va.total,        
      "Status"      : vaData[3],  
      "TrxID"       : va.trxid
    }

    let cTrxID      = va.trxid;
    let nNoRef      = vaData[0];
    let nStandMeter = vaData[1];
    let cPesan      = vaData[2];
    let cStatus     = vaData[3];

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }

    let profileModal, cPage;
    cPage = "RiwayatDetailPlnPascaPage"; //{getItem:data}
    profileModal = this.modalCtrl.create(cPage,{getItem:allData});  

    let cSQL  = "update mutasi set " +  
                "ref = '"+nNoRef+"', standmeter = '"+nStandMeter+"', " +
                "status = '"+cStatus+"', keterangan = '"+cPesan+"' " + 
                "where trxid = '"+cTrxID+"'";
                
     // update to mutasi
     this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 

  }

  funcTRX06Proses(va,vaData){
    let allData = {
      "Rekening"  : va["rekening"], 
      "Tgl"       : va["tgl"] ,
      "Meter"     : va["nometer"] ,
      "Nomor"     : va["idpelanggan"] ,
      "Nama"      : va["namapelanggan"] ,
      "Daya"      : va["daya"] + "VA" , 
      "Ket"       : va["keterangan"] ,
      "Kode"      : va["kode"] ,
      "NoRef2"    : vaData[0],
      "BiayaAdmin" : vaData[1],
      "Materai"    : vaData[2],
      "PPn"        : vaData[3],
      "PPj"        : vaData[4],
      "Angsuran"   : vaData[5],
      "Stroom"     : vaData[6],
      "KWH"        : vaData[8],
      "Token"      : vaData[9],
      "TotalBayar" : vaData[7],
      "TrxID"      : vaData[10],
      "Status"     : vaData[11],
      "Message"    : ""
    }
    let nNoRef2     = vaData[0];
    let nBiayaAdmin = vaData[1];
    let nMaterai    = vaData[2];
    let nPPn        = vaData[3];
    let nPPj        = vaData[4];
    let nAngsuran   = vaData[5];
    let cStroom     = vaData[6];
    let cKWH        = vaData[8];
    let cToken      = vaData[9];
    let nTotalBayar = vaData[7];
    let cTrxID      = vaData[10];
    let cStatus     = vaData[11];
    let cMessage    = "";

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }

    console.log(cTrxID);
    let profileModal, cPage;
    cPage = "RiwayatDetailPlnPraPage"; //{getItem:data}
    profileModal = this.modalCtrl.create(cPage,{getItem:allData});  

    let cSQL  = "update mutasi set " + 
    "jumlahtagihan = '"+cStroom+"', admin = '"+nBiayaAdmin+"', ref = '"+nNoRef2+"', " +
    "materai = '"+nMaterai+"', ppn = '"+nPPn+"', ppj = '"+nPPj+"', angsuran = '"+nAngsuran+"', " +
    "stroom = '"+cStroom+"', total = '"+nTotalBayar+"', kwh = '"+cKWH+"', tokenlistrik = '"+cToken+"', " +
    "status = '"+cStatus+"', keterangan = '"+cMessage+"' " + 
    "where trxid = '"+cTrxID+"'";
    
    // update to mutasi
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
  }


  funcTRX11Proses(va,vaData){
    console.log(vaData);
    let allData = {
        'Tgl'         : va.tgl,
        'NoResi'      : vaData[2], //v
        'Rekening'    : va.rekening,
        'NamaKredit'  : va.namakredit,
        'IDPel'       : va.nokontrak, 
        'NamaPelanggan': va.nama,
        'IDReff'      : va.idreff,
        'NoAngsuran'  : va.noangsuran,
        'Tagihan'     : va.jumlahtagihan,
        'Admin'       : vaData[1], //v
        'TotalTagihan': va.total, 
        'Status'      : vaData[0] //v
    }

    let cTrxID      = va.trxid;
    let nAdmin      = vaData[1];
    let cStatus     = vaData[0];
    let cResi       = vaData[2];

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }

    let profileModal, cPage;
    cPage = "RiwayatDetailFinancePage"; //{getItem:data}
    profileModal = this.modalCtrl.create(cPage,{getItem:allData});  
    
    //let cSQL = "INSERT INTO mutasi(trx,kode,trxid,tgl,noresi,namakredit,nokontrak,nama,namapelanggan,idreff,
    //noangsuran,jumlahtagihan,admin,total,datetime) " ;
    //   cSQL += "VALUES('"+this.cTrx+"','"+this.cFinance+"','"+cTrxID+"','"+this.func.SNow()+"','"+cTrxID+"',
    //'"+this.cPerusahaan+"','"+this.cNomor+"','"+this.cNama+"','','"+cTrxID+"','"+this.cKe+"','"+this.cNominal+"',
    //'"+this.cAdmin+"','"+this.cTotalBayar+"','"+this.func.SNow()+"')" ;

    let cSQL  = "update mutasi set " +  
                "noresi = '"+cResi+"', admin = '"+nAdmin+"', status = '"+cStatus+"' "+ 
                "where trxid = '"+cTrxID+"'";
                
     // update to mutasi
     this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
   }

  funcTRX09Proses(va,vaData){



    let allData = {
      "Tgl"         : va.tgl,
      'Jenis'       : "Telepon Pascabayar",
      'Rekening'    : va.rekening,
      'IDPel'       : va.idpelanggan,
      'Nama'        : va.namapelanggan,
      "Ref"         : vaData[1],
      "Resi"        : vaData[3],
      "Bulan"       : va.bulan,
      "Admin"       : va.admin,
      "Tagihan"     : va.jumlahtagihan,
      "Total"       : va.total,        
      "Status"      : vaData[0],  
      "TrxID"       : va.trxid
    }
    let cTrxID      = va.trxid;
    let cStatus     = vaData[0];
    let nNoRef      = vaData[1];
    let cResi       = vaData[3];

    console.log("IKI OPO YO = " + cStatus + "~" + nNoRef + "~" + cResi);

    if(cStatus == "S"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }
    
    let profileModal, cPage;
    cPage = "RiwayatDetailTeleponPage"; //{getItem:data}
    profileModal = this.modalCtrl.create(cPage,{getItem:allData});  

    let cSQL  = "update mutasi set " +  
                "ref = '"+nNoRef+"', " +
                "noresi = '"+cResi+"', " +
                "status = '"+cStatus+"' " + 
                "where trxid = '"+cTrxID+"'";
                
     // update to mutasi
     this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 

  }

  funcTRX12Proses(va,vaStatus){
    let cTrxID      = va.trxid;
    let cStatus     = vaStatus;

    if(cStatus == "0"){
      cStatus = "Proses";
    }else if(cStatus == "1"){
      cStatus = "Sukses";
    }else{
      cStatus = "Gagal";
    }
  
    let allData = {
      "Tgl"           : va.tgl,
      "Jenis"         : "Kirim Uang Antar Bank",
      "Rekening"      : va.rekening,
      "RekeningTujuan": va.idpelanggan,
      "Total"         : va.total,        
      "Status"        : cStatus,  
      "TrxID"         : va.trxid,
      "Keterangan"    : va.keterangan
    } 
    
    //console.log(allData);
    let cPage = "RiwayatDetailTransferAntarbankPage"; //{getItem:data}
    let profileModal = this.modalCtrl.create(cPage,{getItem:allData});
    
    let cSQL  = "update mutasi set status = '"+cStatus+"' where trxid = '"+cTrxID+"'";
                
     // update to mutasi
     this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => profileModal.present())
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 

   }
}