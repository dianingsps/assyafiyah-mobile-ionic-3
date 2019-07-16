import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController } from 'ionic-angular';
import { Func } from '../../service/func' ;

/**
 * Generated class for the AkunMutasiDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-akun-mutasi-detail',
  templateUrl: 'akun-mutasi-detail.html',
})
export class AkunMutasiDetailPage {
  detail    = "";//[];
  data      = [];
  cTitle    = "Detail Mutasi";
  cFaktur   = "";
  dTgl      = ""; 
  cKet      = "";
  cJenis    = "";
  nNominal  = "0.00";
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public func:Func,public modalCtrl: ModalController) {
    this.detail = this.navParams.get("detail") ; 
    this.fetchDetail(this.detail);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AkunMutasiDetailPage');
  }

  fetchDetail(detail){
    let vaDetail  = detail.split("_") ;  
    this.cFaktur  = vaDetail[0] ; 
    this.dTgl     = vaDetail[1].replace(/"-"/g,"/");
    this.cKet     = vaDetail[5] ;

    this.cJenis   = "Debet";
    this.nNominal = vaDetail[3] ;
    if(vaDetail[2] == "K"){
      this.nNominal = vaDetail[4] ; 
      this.cJenis = "Kredit" ;   
    }
    this.nNominal = this.func.number2String(parseInt(this.nNominal.substring(0,10)),2);      
  }

  dismiss(){
    this.navCtrl.pop() ; 
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
