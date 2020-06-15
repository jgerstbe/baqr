import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';
import * as QRCode from 'qrcode';
import * as vCardsJS from '../../assets/vcards-js';
import * as downloadJS from 'downloadjs';
import { BaqrCreateModalComponent } from '../baqr-create-modal/baqr-create-modal.component';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  vCards: any[] = [];
  loading: HTMLIonLoadingElement = null;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    public storage: StorageService,
    public loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({});
    this.loadVcards();
  }

  async loadVcards() {       
    await this.loading.present();
    this.vCards = this.storage.getItems();
    if (this.vCards.length === 0) {
      this.loading.dismiss();
    } else {
      this.vCards.forEach((e, index) => {
        let vCard = vCardsJS();
        Object.keys(e.vCard).forEach(k => {
          vCard[k] = e.vCard[k];
        });
        QRCode.toDataURL(vCard.getFormattedString(), (error, string) => {  
          if (error) {
            console.error(error);
            return;
          }
          this.vCards[index].qrSrc = string;   
          if (index === this.vCards.length-1) {
            this.loading.dismiss();
          }
        });
      }); 
    } 
  }

  // downloadJS(string, 'vcard-qr.png', 'image/png')

  async presentAlert(text:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: null,
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(text:string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: BaqrCreateModalComponent,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(() => this.loadVcards());
    return await modal.present();
  }

}
