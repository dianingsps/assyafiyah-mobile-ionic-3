import { Component,ViewChild } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { AkunPage } from '../akun/akun';
import { PulsaPage } from '../pulsa/pulsa';
import { BpjsPage } from '../bpjs/bpjs';
import { PaymentPage } from '../payment/payment';
import { RiwayatPage } from '../riwayat/riwayat';
import { SettingPage } from '../setting/setting';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Func } from '../../service/func' ;
import { HomeMenuPage } from '../home-menu/home-menu';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html', 
})
export class IndexPage {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  cNamaNasabah = "";
  additionaldata = "";
  jenis = "";
  sn = "";
  title = "";
  message = "";
  trxid = "";
  status = "";
  timestamp = "";
  bpjsEnabled = true;

  cUserName = localStorage.getItem("UserName") ;
  tab1Root  = AkunPage;
  tab2Root  = PulsaPage;
  tab3Root  = BpjsPage;
  tab4Root  = PaymentPage ;
  tab5Root  = RiwayatPage;
  tab6Root  = HomeMenuPage;

  // to dynamically disable bottom tab
  bottomTabEnabled = true;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private sqlite: SQLite,
              public func:Func,
              public platform:Platform,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    this.pages = [
      //{ title: 'Pesan Saya', component: PesanSayaPage },
      { title: 'Informasi Rekening', component: AkunPage }, 
      { title: 'Prabayar', component: PulsaPage },
      { title: 'Pascabayar', component: PaymentPage },
      { title: 'BPJS', component: BpjsPage },
      { title: 'Riwayat', component: RiwayatPage },
      { title: 'Setting', component: SettingPage }
      //{ title: 'List', component: ListPage }
    ]; 
    this.cNamaNasabah = localStorage.getItem("NamaNasabah") ;
    if(localStorage.getItem("MenuBPJS") == "0") { 
      this.bpjsEnabled = false;
    }
  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }
  
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //this.nav.setRoot(page.component);
    this.nav.setRoot(page.component);
  }
 
  olahNotif(vaData,cJenis,cStatus,cTrxID,cSN){
    //alert("sapi " + cStatus);
    let nAdmin    = 0;
    let nMaterai  = 0;
    let nPPn      = 0;
    let nPPj      = 0;
    let nAngsuran = 0;
    let nTotal    = 0; 
    let cRef      = '';
    let cKWH      = '';
    let cToken    = '';
    let cMessage  = '';
    let nTagihan  = 0;
    let cStandMeter = '';
    let cSQL      = "update mutasi set status = '"+cStatus+"' where trxid = '"+cTrxID+"'";
    let cSQL1     = "INSERT INTO message (judul,pesan,datetime) " +
        "VALUES ('Transaksi no. " +cTrxID+"','"+cMessage+"','"+this.func.SNow()+"')";

    if(cStatus == "Berhasil"){
      if(cJenis == "PLNPRA"){
        nTagihan  = vaData[0]["Stroom"];
        nAdmin    = vaData[0]["Admin"];
        nTotal    = vaData[0]["Total"];
        cRef      = vaData[0]["Ref"];
        nMaterai  = vaData[0]["Materai"];
        nPPn      = vaData[0]["PPN"];
        nPPj      = vaData[0]["PPJ"];
        nAngsuran = vaData[0]["Angsuran"];
        cKWH      = vaData[0]["KWH"];
        cToken    = vaData[0]["Token"];
        cMessage  = vaData[0]["Pesan"];
        cMessage  = cMessage.replace(/#/g, " ");
        cSQL  = "update mutasi set " + 
                "jumlahtagihan = '"+nTagihan+"', admin = '"+nAdmin+"', ref = '"+cRef+"', " +
                "materai = '"+nMaterai+"', ppn = '"+nPPn+"', ppj = '"+nPPj+"', angsuran = '"+nAngsuran+"', " +
                "stroom = '"+nTagihan+"', total = '"+nTotal+"', kwh = '"+cKWH+"', tokenlistrik = '"+cToken+"', " +
                "status = '"+cStatus+"', keterangan = '"+cMessage+"' " + 
                "where trxid = '"+cTrxID+"'";
        cSQL1 = "INSERT INTO message (judul,pesan,datetime) " +
        "VALUES ('Transaksi no. " +cTrxID+"','"+cMessage+"','"+this.func.SNow()+"')";
      }else if(cJenis == "PLNPASCA"){
        cStandMeter = vaData[0]["StandMeter"];
        cRef        = vaData[0]["Ref"];
        cMessage    = vaData[0]["Pesan"];
        cSQL  = "update mutasi set " +  
                "ref = '"+cRef+"', standmeter = '"+cStandMeter+"', " +
                "status = '"+cStatus+"', keterangan = '"+cMessage+"' " + 
                "where trxid = '"+cTrxID+"'";
        cSQL1 = "INSERT INTO message (judul,pesan,datetime) " +
        "VALUES ('Transaksi no. " +cTrxID+"','"+cMessage+"','"+this.func.SNow()+"')";   
        
      }else if(cJenis == "PULSA"){
        cSQL  = "update mutasi set " + 
                "ref = '"+cSN+"', "+
                "status = '"+cStatus+"', keterangan = '"+cMessage+"', " + 
                "where trxid = '"+cTrxID+"'";
        cSQL1 = "INSERT INTO message (judul,pesan,datetime) " +
        "VALUES ('Transaksi no. " +cTrxID+"','"+cMessage+"','"+this.func.SNow()+"')";
      }
    }
    
    // update to mutasi
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL, {}) 
          .then(() => console.log('update table mutasi gan'))
          .catch(e => console.log("catch db"));
      })
      .catch(e => console.log("catch")); 
    
    // update to messagr 
    this.sqlite.create({   
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
        db.executeSql(cSQL1, {}) 
          .then(() => console.log('update table nessage gan'))
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

}