import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { Func } from '../../service/func' ;

/**
 * Generated class for the RiwayatDetailTeleponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-telepon',
  templateUrl: 'riwayat-detail-telepon.html',
})
export class RiwayatDetailTeleponPage {

  cTitle    = '' ;
  dTgl      = '' ;
  cRekening = '' ; 
  cMeter    = '' ; 
  cNomor    = '' ;
  cNama     = '' ;
  cRef      = '' ;
  cResi     = '' ;
  nAdminBank= '' ;
  cBulan    = '' ;
  vaBulan   = [] ;
  cBulan1   = '' ;
  cBulan2   = '' ;
  cBulan3   = '' ;
  cTagihan  = '' ;
  vaTagihan = [] ;
  cNominal1 = '' ;
  cNominal2 = '' ;
  cNominal3 = '' ;
  nTotal    = '' ;
  lHide     = false ;
  cStatus   = 'Proses' ;
  data:any  = {} ; 
  cData     = '';
  places: {title:string}[] = [] ;
  selectedValue: number;
  loading: Loading;
  
  constructor(public navCtrl: NavController, public func:Func, public navParams: NavParams,
    public loadingCtrl: LoadingController) { 

      console.log("MASUK RIWATAY DDRTAIL TELEPON");

    this.cData = this.navParams.get("getItem"); 
    console.log('getData->',this.cData); 
    if(this.cData != null){
      this.cTitle     = this.cData["Jenis"] ;
      this.cRekening  = this.cData["Rekening"] ;
      this.dTgl       = this.cData["Tgl"] ;
      this.cNomor     = this.cData["IDPel"] ;
      this.cNama      = this.cData["Nama"] ;      
      this.cRef       = this.cData["Ref"] ;
      this.cResi      = this.cData["Resi"] ;
      this.cBulan     = this.cData["Bulan"] ;
      this.nAdminBank = "Rp. " + this.func.number2String(this.cData["Admin"],2) ;
      this.cTagihan   = "Rp. " + this.func.number2String(this.cData["Tagihan"],2) ;
      this.nTotal     = "Rp. " + this.func.number2String(this.cData["Total"],2) ;
      this.cStatus    = this.cData["Status"] ;
    }else{
      this.cTitle     = this.navParams.get("Jenis") ;
      this.cRekening  = this.navParams.get("Rekening") ;
      this.dTgl       = this.navParams.get("Tgl") ;
      this.cNomor     = this.navParams.get("IDPel") ;
      this.cNama      = this.navParams.get("Nama") ;
      this.cRef       = this.navParams.get("Ref") ;
      this.cResi      = this.navParams.get("Resi") ;
      this.cBulan     = this.navParams.get("Bulan") ;
      this.nAdminBank = "Rp. " + this.func.number2String(this.navParams.get("Admin"),2) ;
      this.cTagihan   = "Rp. " + this.func.number2String(this.navParams.get("Tagihan"),2) ;
      this.nTotal     = "Rp. " + this.func.number2String(this.navParams.get("Total"),2) ;
      this.cStatus    = this.navParams.get("Status") ;
    }
    
    if(this.cStatus == "S" || this.cStatus == "Sukses"){
      this.cStatus = "Sukses";
    }else{
      this.cStatus = "Gagal";
    }

    // JIKA TAGIHAN LEBIH DARI 1, TAMPILKAN RINCIAN PER BULAN
    if(this.cBulan.indexOf(",") > 0){
      this.vaBulan = this.cBulan.split(",");
      this.cBulan1 = this.vaBulan.length > 0 ? this.vaBulan[0] : "-";
      this.cBulan2 = this.vaBulan.length > 1 ? this.vaBulan[1] : "-";
      this.cBulan3 = this.vaBulan.length > 2 ? this.vaBulan[2] : "-";
    }else{
      this.cBulan1  = this.cBulan;
      this.lHide    = true;
    }

    // JIKA TAGIHAN LEBIH DARI 1, TAMPILKAN RINCIAN PER BULAN
    if(this.cTagihan.indexOf("|") > 0){
      this.vaTagihan  = this.cTagihan.split("|");
      this.cNominal1  = this.vaTagihan.length > 0 ? "Rp. " + this.func.number2String(this.vaTagihan[0],2) : "0";
      this.cNominal2  = this.vaTagihan.length > 1 ? "Rp. " + this.func.number2String(this.vaTagihan[1],2) : "0";
      this.cNominal3  = this.vaTagihan.length > 2 ? "Rp. " + this.func.number2String(this.vaTagihan[2],2) : "0";
    }else{
      this.cNominal1 = this.cTagihan ;
      this.lHide    = true;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailTeleponPage');
    this.showLoading();
    this.stopLoading();
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Memuat data...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  stopLoading(){
    this.loading.dismiss() ;
  }

}