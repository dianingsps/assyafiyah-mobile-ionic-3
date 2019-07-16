import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Func } from '../../service/func' ;

/**
 * Generated class for the RiwayatDetailPlnPascaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-pln-pasca',
  templateUrl: 'riwayat-detail-pln-pasca.html',
})
export class RiwayatDetailPlnPascaPage {
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
  cData     = '';
  places: {title:string}[] = [] ;
  selectedValue: number;
  
  constructor(public navCtrl: NavController, 
              public func:Func,
              public navParams: NavParams) { 
    this.cData = this.navParams.get("getItem"); 
    console.log('getData->',this.cData); 
    if(this.cData != null){
      this.cTitle     = this.cData["Jenis"] ;
      this.cRekening  = this.cData["Rekening"] ;
      this.dTgl       = this.cData["Tgl"] ;
      this.cNomor     = this.cData["IDPel"] ;
      this.cNama      = this.cData["Nama"] ;
      this.cDaya      = this.cData["Daya"] ;
      this.cRef       = this.cData["Ref"] ;
      this.cBulan     = this.cData["Bulan"] ;
      this.cStandMeter= this.cData["StandMeter"] ;
      this.nAdminBank = this.cData["Admin"] ;
      this.nTagihan   = this.cData["Tagihan"] ;
      this.nTotal     = this.cData["Total"] ;
      // this.nAdminBank = "Rp. " + this.func.number2String(this.navParams.get("Admin"),2) ; 
      // this.nTagihan   = "Rp. " + this.func.number2String(this.navParams.get("Tagihan"),2) ; 
      // this.nTotal     = "Rp. " + this.func.number2String(this.navParams.get("Total"),2);
      this.cStatus    = this.cData["Status"] ;
    }else{
      this.cTitle     = this.navParams.get("Jenis") ;
      this.cRekening  = this.navParams.get("Rekening") ;
      this.dTgl       = this.navParams.get("Tgl") ;
      this.cNomor     = this.navParams.get("IDPel") ;
      this.cNama      = this.navParams.get("Nama") ;
      this.cDaya      = this.navParams.get("Daya") ;
      this.cRef       = this.navParams.get("Ref") ;
      this.cBulan     = this.navParams.get("Bulan") ;
      this.cStandMeter= this.navParams.get("StandMeter") ;
      this.nAdminBank = this.navParams.get("Admin") ;
      this.nTagihan   = this.navParams.get("Tagihan") ;
      this.nTotal     = this.navParams.get("Total") ;
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
    console.log('ionViewDidLoad RiwayatDetailPlnPascaPage');
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

}