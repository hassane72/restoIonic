import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user';
import {CommandesService} from '../services/commandes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionSheetController, AlertController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {ConfirmPassword} from '../helpers/confirm-password.validator';
import {DateFormatPipe} from '../helpers/dateFormatPipe.pipe';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-compte',
  templateUrl: 'compte.page.html',
  styleUrls: ['compte.page.scss']
})
export class ComptePage implements OnInit{
  images = [];
  image: any;
  user: any = {};
  userUpdate: User = new User();
  commandes: any = [];
  updateForm: FormGroup;
  validation_messages = {
    name: [
      { type: 'required', message: 'Champs Obligatoire.' }
    ]
  };
  constructor(private auth: AuthService, private commandesService: CommandesService,
              public loadingController: LoadingController, private formBuilder: FormBuilder,
              private alertCtrl: AlertController, private dateFormatPipe: DateFormatPipe,
              private camera: Camera, private file: File, private webview: WebView,
              private actionSheetController: ActionSheetController, private toastController: ToastController,
              private storage: Storage, private plt: Platform,
              private ref: ChangeDetectorRef, private filePath: FilePath) {}

  ionViewWillEnter() {
    console.log(this.dateFormatPipe.transform(Date.now()));
    if (this.user.role.type === 'admin') {
      this.commandesService.getAllCommande().subscribe( (res: any) => {
        console.log(res);
        this.commandes = [...res];
      });
    } else {
      this.commandesService.getCommandeByUser(this.user).subscribe( (res: any) => {
        console.log(res);
        this.commandes = [...res];
      });
    }
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.user = JSON.parse(JSON.stringify(this.auth.getUser()));
    console.log('ngOninit: ' + this.user);
    this.updateForm = this.formBuilder.group({
      username : [this.user.username, [Validators.required, Validators.minLength(3)]],
      email : [this.user.email, [Validators.required, Validators.email]],
      password : ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {validators: ConfirmPassword.MatchPassword  });
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }

  update(userInfo: any) {
    console.log(userInfo);
    this.userUpdate.username = userInfo.username;
    this.userUpdate.email = userInfo.email;
    // tslint:disable-next-line:triple-equals
    if (userInfo.password != '') {
      this.userUpdate.password = userInfo.password;
    }
    console.log(this.userUpdate);
    this.auth.getUserByEmail(this.user.email).subscribe(async ( res: any) => {
          console.log(res);
          const result = [...res, ...[]];
          console.log(result);
          if (result.length > 0) {
            console.log(result[0].id);
            this.auth.updateProfile(+result[0].id, this.userUpdate).subscribe( async item => {
              console.log(item);
              this.user = item;
              const alert_2 = await this.alertCtrl.create({
                header: 'Success',
                message: 'Operation reussi',
                buttons: ['OK']
              });
              await alert_2.present();
            });
          } else {
            const alert_1 = await this.alertCtrl.create({
              header: 'Login Failed',
              message: 'Email incorrect',
              buttons: ['OK']
            });
            await alert_1.present();
          }
        },
        async err => {
          // console.log(err);
        });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        const arr = JSON.parse(images);
        this.images = [];
        for (const img of arr) {
          const filePath = this.file.dataDirectory + img;
          const resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath });
        }
      }
    });
  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Gallery',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        console.log('1 :' + imagePath);
        this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              console.log('2 :' + filePath);
              const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              console.log('3 :' + correctPath);
              const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              console.log('4 :' + currentName);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
      } else {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        console.log('2 :' + currentName);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        console.log('3 :' + correctPath);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }

    });

  }

  createFileName() {
    const d = new Date(),
        n = d.getTime(),
        newFileName = n + '.jpg';
    console.log('new File name: ' + newFileName);
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      console.log('6 : ' + images);
      const arr = JSON.parse(images);
      console.log('arr :' + arr);
      if (!arr) {
        const newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      const filePath = this.file.dataDirectory + name;
      console.log('final1 :' + filePath);
      const resPath = this.pathForImage(filePath);
      console.log('final2 :' + resPath);

      const newEntry = {
        name,
        path: resPath,
        filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }
  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);
      const filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('File removed.');
      });
    });
  }
}
