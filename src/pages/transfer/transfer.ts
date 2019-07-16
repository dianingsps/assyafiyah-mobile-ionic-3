import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController, Events } from 'ionic-angular';
import { TransferDaftarPage } from '../transfer-daftar/transfer-daftar' ;  
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Func } from '../../service/func' ; 
import { TransferProsesPage } from '../transfer-proses/transfer-proses' ;  


/**
 * Generated class for the TransferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() 
@Component({  
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {
  cRekening = "" ;
  data = [] ;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private sqlite: SQLite,public events: Events,
              public func:Func) {

    events.subscribe('rekening:tambah', () => { 
      this.loadRekening() ; 
      });  
  } 
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferPage');
    this.loadRekening() ;
  } 

  public showAlert(msg:string,title:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
   
  add(){           
    let profileModal = this.modalCtrl.create(TransferDaftarPage, {});
    profileModal.present();
  }  

  proses(){   
    if(this.cRekening !== ""){
      let vaData = this.cRekening.split("-") ;
      let profileModal = this.modalCtrl.create(TransferProsesPage, { 
        'Rekening':vaData[0],
        'Nama':vaData[1]
      });
      profileModal.present();  
    }else{
      this.showAlert("Rekening Harus Dipilih...","Perhatian :") ;
    }
  }  

  loadRekening(){  
    let cSQL = "SELECT * FROM transfer_rekening ORDER BY datetime ASC " ;
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
        this.data.push({rekening: data.rows.item(i).rekening,
                        nama: data.rows.item(i).nama
                      });
      }        
    } 
    return this.data;
  }

}
