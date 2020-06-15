import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import * as vCardsJS from '../../assets/vcards-js';
import * as QRCode from 'qrcode';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-baqr-create-modal',
  templateUrl: './baqr-create-modal.component.html',
  styleUrls: ['./baqr-create-modal.component.scss'],
})
export class BaqrCreateModalComponent {
  vCard = vCardsJS();

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public storage: StorageService,
  ) { 
    this.vCard.version = '3.0';
  }

  save() {
    this.storage.saveVcard(this.vCard);
    this.modalController.dismiss();
  }
}
