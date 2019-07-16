import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the SettingRiwayatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting-riwayat',
  templateUrl: 'setting-riwayat.html',
})
export class SettingRiwayatPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,private sqlite: SQLite) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingRiwayatPage');
  }

  riwayattransaksi(){
    let confirm = this.alertCtrl.create({
      title: 'Hapus Riwayat Transaksi ?', 
      message: 'Apakah anda yakin ingin menghapus semua riwayat transaksi aplikasi ini ?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.hapustransaksi() ;
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  hapustransaksi(){ 
    let cSQL = "DELETE FROM mutasi " ;
    this.sqlite.create({    
      name: 'data.db', 
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(cSQL, {})  
          .then(() => this.showToast("Hapus Riwayat Transaksi Berhasil","bottom"))
          .catch(e => this.showToast("Gagal menghapus","bottom"));
      })
      .catch(e => this.showToast("Ada Kesalahan di aplikasi","bottom")); 
  } 

  showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  }
}
