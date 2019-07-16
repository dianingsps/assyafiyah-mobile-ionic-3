import { Func } from './../../service/func';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RiwayatDetailTransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-transfer',
  templateUrl: 'riwayat-detail-transfer.html',
})
export class RiwayatDetailTransferPage {
  cTitle          = '';
  dTgl            = '';
  cRekening       = '';
  cRekeningTujuan = '';
  cNama           = '';
  cKeterangan     = '';
  nNominal        = '';
  cStatus         = '';
  constructor(public navCtrl: NavController, 
              public func: Func,
              public navParams: NavParams) {
    this.cTitle     = this.navParams.get("Jenis") ;
    this.cRekening  = this.navParams.get("Rekening") ;
    this.dTgl       = this.navParams.get("Tgl") ;
    this.cRekeningTujuan = this.navParams.get("RekeningTujuan") ;
    this.cNama      = this.navParams.get("Nama") ;
    this.cKeterangan= this.navParams.get("Keterangan") ;
    this.nNominal   = "Rp. " + this.func.number2String(this.navParams.get("Nominal"),2);
    this.cStatus    = this.navParams.get("Status") ;
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailTransferPage');
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }

}
