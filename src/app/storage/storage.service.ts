import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  saveVcard(vCard:any) {
    if (!vCard) {
      console.error('saveVcard - missing data.')
      return;
    }
    const items = this.getItems();
    items.push(this.mkCard(vCard));
    this.setItems(items);
  }

  updateVcard(vCard:string, uuid:string) {
    if (!vCard || !uuid) {
      console.error('updateVcard - missing data.')
      return;
    }
    const items = this.getItems();
    const index = items.findIndex(e => e.uiild === uuid);
    items[index] = this.mkCard(vCard);
    this.setItems(items);
  }

  deleteVcard(uuid:string):void {
    const items = localStorage.getItem('bq-qr-storage') || [];
    localStorage.removeItem(uuid);
  }

  mkCard(vCard:string, uuid?:string) {
    return {
      uuid: uuid || uuidv4(),
      vCard: vCard,
      timestamp: new Date().getTime()
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
