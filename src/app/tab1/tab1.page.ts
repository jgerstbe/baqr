
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;
 
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;
  scanTimeout: number = 250;
  scanCount: number = 0;
 
  constructor(
    public alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }
 
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
    this.startScan();
  }
 
  // Helper functions
  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }

  async startScan() {
    // Not working on iOS standalone mode!
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
   
      this.videoElement.srcObject = stream;
      // Required for Safari
      this.videoElement.setAttribute('playsinline', true);
     
      this.loading = await this.loadingCtrl.create({});
      await this.loading.present();
     
      this.videoElement.play();
      setTimeout(() => requestAnimationFrame(this.scan.bind(this)), this.scanTimeout);
    } catch (e) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error!',
        message: 'We could not detect/access any camera input device.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
   
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
   
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
   
      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log('CODE', code)
   
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        // this.showQrToast();
      } else {
        if (this.scanActive) {
          if (this.scanCount++ < 20) {
            setTimeout(() => requestAnimationFrame(this.scan.bind(this)), this.scanTimeout);
          } else {
            this.scanCount = 1;
            this.scanActive = false;
          }
        }
      }
    } else {
      if (this.scanCount++ < 20) {
        setTimeout(() => requestAnimationFrame(this.scan.bind(this)), this.scanTimeout);
      } else {
        this.scanCount = 1;
        this.scanActive = false;
      }
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }
   
  handleFile(files: FileList) {
    const file = files.item(0);
   
    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
   
      if (code) {
        this.scanResult = code.data;
        // this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }
 
  reset() {
    this.scanResult = null;
    this.scanActive = true;
    this.scan()
  }
 
  stopScan() {
    this.scanActive = false;
  }
}
