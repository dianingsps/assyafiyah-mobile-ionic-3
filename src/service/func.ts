//import { Component } from '@angular/core'; 
import { AlertController,ToastController,LoadingController,Loading, Platform } from 'ionic-angular'; 
//import { Http } from '@angular/http'; 
//import { SQLite } from '@ionic-native/sqlite'; 
import { StatusBar } from '@ionic-native/status-bar';

export class Func {  

  loading: Loading; 
  toastCtrl : ToastController ;  
  loadingCtrl : LoadingController ;
  alertCtrl : AlertController ;
  //private sqlite: SQLite;

  public getSuasana(){
    let nJam = new Date().getHours();
    let cUcapan = "Selamat Malam"; 
    if(nJam <= 10){
      cUcapan = "Selamat Pagi";
    }else if(nJam <= 14){
      cUcapan = "Selamat Siang";
    }else if(nJam <= 18){
      cUcapan = "Selamat Sore";
    }
    return cUcapan;
  }

  setStatusBarColor(platform : Platform,statusbar : StatusBar, warna,suasana){
    let platformVersion = platform.versions();
    if (platformVersion.android) {
      if(androidV => 6.0){
        statusbar.backgroundColorByHexString(warna); 
        if(suasana == "terang"){
          statusbar.styleDefault();
        }else{
          statusbar.styleLightContent();  
        }
      }else{ 
        statusbar.styleLightContent();
      }
    }else{ 
      statusbar.styleDefault();
    }
  }

  public showToast(msg:string,pos:string) {
    let toast = this.toastCtrl.create({
      message: msg, 
      duration: 3000,
      position: pos
    });
    toast.present();
    
  }

  showLoading() {
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
    let vaData = {"":"Request Timeout",
                  "00":"Berhasil",
                  "01":"PIN salah",
                  "02":"Nomor HP belum diaktivasi",
                  "03":"Rekening tidak ditemukan",
                  "04":"Saldo tidak cukup untuk transaksi ini",
                  "05":"Rekening telah diblokir",
                  "06":"Rekening sudah ditutup",
                  "07":"Limit penarikan melebihi maksimum",
                  "08":"Limit transfer melebihi maksimum",
                  "09":"Kode produk tidak ditemukan",
                  "10":"Belum ada tagihan / tagihan sudah lunas",
                  "11":"Gangguan jaringan", 
                  "12":"Tidak ada mutasi",
                  "13":"Transaksi dalam proses. Mohon tunggu sms konfirmasi",
                  "14":"Nominal kurang dari angka minimal",
                  "15":"Maaf, transaksi kirim uang melebihi limit",
                  "16":"Bank tujuan belum terdaftar",
                  "17":"Nomor HP yang dipilih tidak valid",
                  "XX": "Request timeout... coba lagi nanti",
                  "XS": "Nomor pelanggan tidak ditemukan"};
    if(vaData[cRC] == undefined) vaData[cRC] = "Request timeout" ;
    return vaData[cRC] ;   
  } 

  public getRCFastpay(cRC:string){  
    let vaData = {"":"Timeout",
                  "00":"Berhasil",
                  "06":"Request gagal, periksa kembali ID pelanggan / nomor pelanggan",
                  "07":"Maaf, produk yang dipilih sedang dalam gangguan...Coba lagi nanti",
                  "14":"Nomor meter / ID Pelanggan tidak ditemukan...",
                  "21":"ID Pelanggan tidak dapat digunakan untuk produk yang dipilih",
                  "24":"Maaf, server sedang sibuk. Coba lagi dalam 5-10 menit",
                  "30":"Nomor meter / ID Pelanggan tidak ditemukan...",
                  "34":"Belum ada tagihan / tagihan sudah lunas",
                  "35":"Request timeout...Coba lagi nanti",
                  "68":"Request timeout...Coba lagi nanti",
                  "76":"Request timeout...Coba lagi nanti",
                  "77":"Nomor meter / ID Pelanggan tidak ditemukan",
                  "XX":"Maaf, produk yang dipilih sedang dalam gangguan...Coba lagi nanti",
                }; 
    if(vaData[cRC] == undefined) vaData[cRC] = "Request timeout" ;
    return vaData[cRC] ;   
  } 

  public getRCBiller(cRC:string){  
    let vaData = {"":"Timeout",
                  "00":"Sukses",
                  "2":"Username / PIN tidak cocok.",
                  "4":"Layanan #PRODUK# belum tersedia.",
                  "5":"GENERAL ERROR",
                  "6":"Saldo anda tidak mencukupi.",
                  "7":"Layanan #PRODUK# sedang dalam gangguan.",
                  "11":"Inquiry record tidak ditemukan. Silahkan melakukan inquiry ulang.",
                  "13":"Transaksi ditolak karena sistem sedang melakukan proses cut off (23.55 - 00.10).",
                  "14":"IDPEL YANG ANDA MASUKKAN SALAH, MOHON TELITI KEMBALI.",
                  "15":"TRX pulsa #KODEPRODUK# #NOHP# duplikat transaksi status akhir : #STATUS#!",
                  "16":"Gagal manual oleh [ADMIN]",
                  "19":"ID Tidak Terdaftar.",
                  "21":"ID anda tidak dapat digunakan untuk transaksi produk ini.",
                  "30":"No Kontrak Salah/Tidak Ditemukan.",
                  "35":"Timeout",
                  "68":"WAKTU TRANSAKSI HABIS, COBA BEBERAPA SAAT LAGI."};
    if(vaData[cRC]== "") vaData[cRC] = "Request timeout" ;
    return vaData[cRC] ;   
  } 

  public getRCTransaksiPPOB(cRC:string){  
    let vaData = {"":"",
                  "00":"Berhasil",
                  "13":"Proses",
                  "14":"Gagal",
                  "S":"Sukses",
                  "G":"Gagal"
                };
    if(vaData[cRC]== "") vaData[cRC] = "" ;
    return vaData[cRC] ;   
  } 

  public pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  public SNow(){
    let dTahun = new Date().getFullYear() ;
    let dBulan = new Date().getMonth()+1 ;
    let dTgl   = new Date().getDate() ;
    let dJam   = new Date().getHours().toString() ; 
    let dMenit = new Date().getMinutes().toString() ;
    let dDetik = new Date().getSeconds().toString() ;  
    let SNow = dTahun + "-" + dBulan + "-" + dTgl + " " + this.pad(dJam,2) + ":" + this.pad(dMenit,2) + ":" + this.pad(dDetik,2) ;
    return SNow ;
  } 

  public getTime(){
    let dJam   = new Date().getHours().toString() ; 
    let dMenit = new Date().getMinutes().toString() ;
    let dDetik = new Date().getSeconds().toString() ;  
    let SNow = this.pad(dJam,2) + this.pad(dMenit,2) + this.pad(dDetik,2) ;
    return SNow ;
  } 

  public getDate(){
    let dBulan = new Date().getMonth()+1 ;
    let dTgl   = new Date().getDate() ;
    let SNow = this.pad(dBulan,2) + this.pad(dTgl,2) ;
    return SNow ;
  }

  public Date(){
    let dTahun = new Date().getFullYear() ;
    let dBulan = new Date().getMonth()+1 ;
    let dTgl   = new Date().getDate() ; 
    let cDate =  dTgl + "-" +  dBulan + "-" + dTahun ;
    return cDate ;
  }
  
  public random(min, max): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public KodeNegara(cHP){
    cHP = "62" + cHP.substr(1)
    return cHP ;
  }

  public date2String(dTgl){
    let vaTgl = dTgl.split("-") ;
    dTgl = vaTgl[2] + "-" + vaTgl[1] + "-" + vaTgl[0] ;
    return dTgl ; 
  }

  public string2Date(cTgl){ 
    let vaTgl = cTgl.split("-") ;
    cTgl = vaTgl[2] + "-" + vaTgl[1] + "-" + vaTgl[0] ;
    return cTgl ; 
  }

  public timeElapsed(s){
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if(hrs==0 && mins==0)
        return 'just a moment ago'; 
    else if(hrs==0)
        return mins+' mins ago';
    else if(hrs<24)
        return hrs+' hours ago';
    else
        return Math.floor(hrs/24)+' days ago';
  }

  public number2String(nNumber,nDecimals){   
    
    var cRetval = "" ;
    var cDigit = "" ;
    var nLen = 0 ;
    var i = 0 ;
    var cSplit = "" ;
     
    var cNumber = "" ;
  
    cRetval = "" ;
    for(i=0;i<nDecimals;i++){
      cDigit += "0" ;
    }
    
    cNumber = nNumber.toString() ; 
    nLen = cNumber.length ;
    for(i=nLen - 3;i > -3;i -= 3){
      cSplit = cNumber.substring(i,i+3) ;    
      if (cSplit !== ""){
        cRetval =  cSplit + "," + cRetval ; 
      }
    } 
    return cRetval + cDigit ; 
  }

  public getNamaBulan(n){
    let vaBulan = {1:"JAN",2:"FEB",3:"MAR",4:"APR",5:"MEI",6:"JUN",7:"JUL",8:"AGT",9:"SEP",10:"OKT",11:"NOV",12:"DES"};
    return vaBulan[n];    
  }

}