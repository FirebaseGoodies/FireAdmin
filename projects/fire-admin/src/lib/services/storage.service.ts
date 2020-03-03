import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable()
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  upload(path: string, file: File): AngularFireUploadTask {
    return this.storage.ref(path).put(file);
  }

  delete(path: string) {
    return this.storage.ref(path).delete();
  }

}
