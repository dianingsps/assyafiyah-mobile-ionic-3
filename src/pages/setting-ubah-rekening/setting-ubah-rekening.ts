import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

/**
 * Generated class for the SettingUbahRekeningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting-ubah-rekening',
  templateUrl: 'setting-ubah-rekening.html',
})
export class SettingUbahRekeningPage {
  cRekening = '' ;
  places: {title:string}[] = [] ;
  selectedValue: number;
  optionsList: Array<{ value: string, text: string, checked: boolean }> = [];
  lTrue = true ;
  cError = "" ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController) {
    let cRekening = localStorage.getItem("RekeningNasabah") ;
    let vaRekening = cRekening.split("-") ;    
    for (var i = 0; i < vaRekening.length; i++) {  
      this.optionsList.push({ value: vaRekening[i], text: vaRekening[i], checked: false });
    }
    this.lTrue = true ;
    this.cError = "" ; 
    this.cRekening = localStorage.getItem("RekeningUtama") ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingUbahRekeningPage');
  }

  showAlert(title:string,msg:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg, 
      buttons: ['OK']
    });
    alert.present();
  }

  validSaving(){
    if(this.cRekening == ""){
      this.lTrue = false ;
      this.cError = "Rekening Harap Diisi..." ;
    }else{
      this.lTrue = true ;
      this.cError = "" ;
    }

    if(this.lTrue == true){
      this.proses() ;
    }else{
      this.showAlert("Pesan : ",this.cError) ;
    }

  }

  proses(){   
    localStorage.setItem("RekeningUtama",this.cRekening) ;   
    this.showAlert("Info","Berhasil mengatur rekening utama ke: " + localStorage.getItem("RekeningUtama")) ;
  }

}
