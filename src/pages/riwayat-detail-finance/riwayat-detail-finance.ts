import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RiwayatDetailFinancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-finance',
  templateUrl: 'riwayat-detail-finance.html',
})
export class RiwayatDetailFinancePage {
  cTitle      = '' ;
  dTgl        = '' ;
  cRekening   = '' ;
  cNoResi     = '' ; 
  cNamaKredit = '' ;
  cIDPel      = '' ;
  cNamaPelanggan = '' ;
  cIDReff     = '' ;
  cNoAngsuran = '' ;
  nAdminBank  = '' ;
  nTagihan    = 0 ;
  nTotal      = 0 ;
  cStatus     = 'Proses' ;
  data:any    = {} ; 
  cData       = '';
  places: {title:string}[] = [] ;
  selectedValue: number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.cData = this.navParams.get("getItem"); 
    console.log('getData->',this.cData);
    
    if(this.cData != null){
      this.cTitle     = this.cData["NamaKredit"] ;
      this.cRekening  = this.cData["Rekening"] ;
      this.dTgl       = this.cData["Tgl"] ;
      this.cNoResi    = this.cData["NoResi"] ;
      this.cNamaKredit    = this.cData["NamaKredit"] ;
      this.cIDPel         = this.cData["IDPel"] ; 
      this.cNamaPelanggan = this.cData["NamaPelanggan"] ;
      this.cIDReff    = this.cData["IDReff"] ;
      this.cNoAngsuran= this.cData["NoAngsuran"] ; 
      this.nAdminBank = this.cData["Admin"] ; 
      this.nTagihan   = this.cData["Tagihan"] ; 
      this.nTotal     = this.cData["TotalTagihan"];
      this.cStatus    = this.cData["Status"] ;
    }else{
      this.cTitle     = this.navParams.get("NamaKredit") ;
      this.cRekening  = this.navParams.get("Rekening") ;
      this.dTgl       = this.navParams.get("Tgl") ;
      this.cNoResi    = this.navParams.get("NoResi") ;
      this.cNamaKredit    = this.navParams.get("NamaKredit") ;
      this.cIDPel         = this.navParams.get("IDPel") ;
      this.cNamaPelanggan = this.navParams.get("NamaPelanggan") ;
      this.cIDReff    = this.navParams.get("IDReff") ;
      this.cNoAngsuran= this.navParams.get("NoAngsuran") ;
      this.nAdminBank = this.navParams.get("Admin") ;
      this.nTagihan   = this.navParams.get("Tagihan") ;
      this.nTotal     = this.navParams.get("TotalTagihan") ;
      this.cStatus    = this.navParams.get("Status") ;
    }
    
    if(this.cStatus == "S" || this.cStatus == "Sukses"){
      this.cStatus = "Sukses";
    }else{
      this.cStatus = "Gagal";
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailFinancePage');
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

}