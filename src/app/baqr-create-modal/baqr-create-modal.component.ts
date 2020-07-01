import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import * as vCardsJS from '../../assets/vcards-js';
import { StorageService } from '../storage/storage.service';
import { baQR } from '../storage/baqr';

@Component({
  selector: 'app-baqr-create-modal',
  templateUrl: './baqr-create-modal.component.html',
  styleUrls: ['./baqr-create-modal.component.scss'],
})
export class BaqrCreateModalComponent {
  @Input() mode: string;
  @Input() data: baQR;
  create: boolean = true;
  vCard = vCardsJS();

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public storage: StorageService,
  ) { 
    this.vCard.version = '3.0';
  }

  ngOnInit() {
    if (this.data) {
      this.create = false;
      this.vCard = this.data.vCard;
    }
  }

  save() {
    if (this.create) {
      this.storage.save(this.vCard);
    } else {
      this.storage.update(new baQR(this.vCard, this.data.uuid));
    }
    this.modalController.dismiss();
  }
}
