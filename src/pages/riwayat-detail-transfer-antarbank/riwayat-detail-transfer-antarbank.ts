import { Func } from './../../service/func';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RiwayatDetailTransferAntarbankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-riwayat-detail-transfer-antarbank',
  templateUrl: 'riwayat-detail-transfer-antarbank.html',
})
export class RiwayatDetailTransferAntarbankPage {

  cTitle          : any;
  dTgl            : any;
  cRekening       : any;
  cRekeningTujuan : any;
  cKeterangan     : any;
  nNominal        : any;
  cStatus         : any;
  cNamaBank       : any;
  cData           : any;
  constructor(public navCtrl: NavController, 
              public func: Func,
              public navParams: NavParams) {
                this.cData = this.navParams.get("getItem"); 
                //console.log('getData->',this.cData);
                if(this.cData != null){
                  this.cTitle     = this.cData["Jenis"] ;
                  this.cRekening  = this.cData["Rekening"] ;
                  this.dTgl       = this.cData["Tgl"] ;
                  this.nNominal   = this.cData["Total"] ;
                  this.cStatus    = this.cData["Status"] ;
                  this.cRekeningTujuan = this.cData["RekeningTujuan"] ;
                  let pecahdataketerangan = this.cData["Keterangan"] ;
                  let pecahkan    = pecahdataketerangan.split("#");
                  this.cNamaBank  = pecahkan[1];
                  this.cKeterangan= pecahkan[2];
                }else{
                  this.cTitle     = this.navParams.get("Jenis") ;
                  this.cRekening  = this.navParams.get("Rekening") ;
                  this.dTgl       = this.navParams.get("Tgl") ;
                  this.nNominal   = this.navParams.get("Total") ;
                  this.cStatus    = this.navParams.get("Status") ;
                  this.cRekeningTujuan = this.navParams.get("RekeningTujuan") ;
                  let pecahdataketerangan = this.navParams.get("Keterangan") ;
                  let pecahkan    = pecahdataketerangan.split("#");
                  this.cNamaBank  = pecahkan[1];
                  this.cKeterangan= pecahkan[2];
                }
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad RiwayatDetailTransferAntarbankPage');
  }

  dismiss(){
    this.navCtrl.pop() ;  
  }
 
}
