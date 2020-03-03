import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable()
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  get(path: string) {
    return this.storage.ref(path);
  }

  upload(path: string, file: File): AngularFireUploadTask {
    return this.get(path).put(file);
  }

  delete(path: string) {
    return this.get(path).delete();
  }

}
