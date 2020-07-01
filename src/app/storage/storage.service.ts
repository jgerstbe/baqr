import { Injectable } from '@angular/core';
import { baQR } from './baqr';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  save(vCard:any) {
    if (!vCard) {
      console.error('save - missing data.')
      return;
    }
    const items = this.getItems();
    items.push(new baQR(vCard));
    this.setItems(items);
  }

  update(baqr:baQR) {
    if (!baqr || !baqr.uuid) {
      console.error('updateVcard - missing data.')
      return;
    }
    const items = this.getItems();
    const index = items.findIndex(e => e.uuid === baqr.uuid);
    items[index] = new baQR(baqr.vCard, baqr.uuid);
    this.setItems(items);
  }

  delete(uuid:string):void {
    let items:any = localStorage.getItem('bq-qr-storage');
    if (items) {
      items = JSON.parse(items);
      const index = items.findIndex(e => e.uuid === uuid);
      items.splice(index, 1)
      this.setItems(items);
    }
  }

  getItems() {
    const items = localStorage.getItem('bq-qr-storage') || [];
    return Array.isArray(items) ? items : JSON.parse(items);
  }

  setItems(items) {
    localStorage.setItem('bq-qr-storage', JSON.stringify(items));
  }

}
