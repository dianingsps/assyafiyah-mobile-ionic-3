import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the PesanSayaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pesan-saya',
  templateUrl: 'pesan-saya.html',
})
export class PesanSayaPage {
  a: any;
  data:any = {} ; 

  appName = 'Ionic App';
  x = {
    "Consultation": [{
      "msg": "This is how you remind me, are we having fun on the war field yet ?",
      "time": "2017-01-01 01:01"
    }],
    "Re - evaluation": [{
      "msg": "When you are balmond and attacked by 5 people but you can wiped them all",
      "time": "2017-01-01 01:01"
    }]
  }

  constructor(public navCtrl: NavController, 
              private sqlite: SQLite,
              public navParams: NavParams) {
    this.a = Object.keys(this.x)
    this.loadPesan();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PesanSayaPage');
  }

  loadPesan(){
    let cSQL = "SELECT * FROM message" ;
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
        this.data.push({judul: data.rows.item(i).judul,
                        pesan: data.rows.item(i).pesan,
                        datetime: data.rows.item(i).datetime                        
                      });
      }         
    } 
    return this.data;
  }

}
