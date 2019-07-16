import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Func } from '../../service/func';

/**
 * Generated class for the RiwayatDetailBpjsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-bpjs',
  templateUrl: 'riwayat-detail-bpjs.html',
})
export class RiwayatDetailBpjsPage {

  cTitle    = '' ;
  dTgl      = '' ;
  cRekening = '' ; 
  cMeter    = '' ; 
  cNomor    = '' ;
  cNama     = '' ;
  cDaya     = '' ;
  cRef      = '' ;
  nAdminBank= '' ;
  cBulan    = '' ;
  cStandMeter = '' ;
  nTagihan  = '' ;
  nTotal    = '' ;
  cStatus   = 'Proses' ;
  data:any  = {} ; 
  cData     = '' ;
  cResi     = '' ;
  cJmlPeserta = '' ;
  cNoReff   = '' ;
  cNoHP     = '' ;
  places: {title:string}[] = [] ;
  selectedValue: number;
  
  constructor(public navCtrl: NavController, 
              public func:Func,
              public navParams: NavParams) { 
    this.cData = this.navParams.get("getItem"); 
    console.log('getData->',this.cData); 
    if(this.cData != null){
      this.cTitle     = this.cData["Jenis"];
      this.cRekening  = this.cData["Rekening"] ;
      this.dTgl       = this.cData["Tgl"] ;
      this.cResi      = this.cData["Resi"] ;
      this.cNomor     = this.cData["IDPel"] ;
      this.cNama      = this.cData["Nama"] ;
      this.cNoHP      = this.cData["HP"] ;
      this.cJmlPeserta= this.cData["Nama"] ;
      this.cBulan     = this.cData["Bulan"] + " bulan" ;
      this.cNoReff    = this.cData["Ref"] ;
      this.nAdminBank = "Rp. " + this.func.number2String(this.cData["Admin"],2) ; 
      this.nTagihan   = "Rp. " + this.func.number2String(this.cData["Tagihan"],2) ; 
      this.nTotal     = "Rp. " + this.func.number2String(this.cData["Total"],2);
      this.cStatus    = this.cData["Status"] ;
    }else{
      this.cTitle     = this.navParams.get("Jenis") ;
      this.cRekening  = this.navParams.get("Rekening") ;
      this.dTgl       = this.navParams.get("Tgl") ;
      this.cResi      = this.navParams.get("Resi") ;
      this.cNomor     = this.navParams.get("IDPel") ;
      this.cNoHP      = this.navParams.get("NoHP") ;
      this.cNama      = this.navParams.get("Nama") ;
      this.cJmlPeserta= this.navParams.get("JmlPeserta") ;
      this.cBulan     = this.navParams.get("Bulan") + " bulan" ;
      this.cNoReff    = this.navParams.get("Ref") ;
      this.nAdminBank = "Rp. " + this.func.number2String(this.navParams.get("Admin"),2) ; 
      this.nTagihan   = "Rp. " + this.func.number2String(this.navParams.get("Tagihan"),2) ; 
      this.nTotal     = "Rp. " + this.func.number2String(this.navParams.get("Total"),2);
      this.cStatus    = this.navParams.get("Status") ;
    }
    
    if(this.cStatus == "S" || this.cStatus == "Sukses"){
      this.cStatus = "Sukses";
    }else if(this.cStatus == "P"){
      this.cStatus = "Proses";  
    }else{
      this.cStatus = "Gagal";
    }
  }

  ionViewDidLoad() {
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

}
