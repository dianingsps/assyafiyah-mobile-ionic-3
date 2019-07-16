import { Component } from '@angular/core';
import { NavController,AlertController,ToastController,LoadingController,Loading } from 'ionic-angular'; 
import { Http } from '@angular/http'; 

@Component({
  templateUrl: 'func.html'
}) 

export class Func {  

  loading: Loading;
  data:any = {} ;
  
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public http: Http) { 
  } 
 
  public showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
    toast.present();
  }

  public showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    }); 
    this.loading.present();
  }

  public stopLoading(){
    this.loading.dismiss() ;
  }

  public showAlert(msg:string,title:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  public getRC(cRC:string){ 
    let vaData = {
                  "00":"Berhasil",
                  "01":"PIN salah",
                  "02":"Nomor HP belum diaktifasi",
                  "03":"Rekening tidak ditemukan",
                  "04":"Saldo tidak cukup",
                  "05":"Rekening Blokir",
                  "06":"Rekening sudah ditutup",
                  "07":"Limit penarikan melebihi maksimum",
                  "08":"Limit transfer melebihi maksimum",
                  "09":"Kode produk tidak ditemukan",
                  "10":"Belum ada tagihan / sudah lunas",
                  "11":"Gangguan jaringan",
                  "12":"Tidak ada mutasi",
                  "13":"Transaksi Dalam proses"
                 };
    return vaData[cRC] ;
  }

}
