import { Injectable, Inject } from '@angular/core';
import { FirebaseConfigService } from './services/firebase-config.service';

@Injectable({
  providedIn: 'root'
})
export class FireAdminService {

  constructor(@Inject(FirebaseConfigService) private firebaseConfig) { }

  static getFirebaseConfig(self: FireAdminService) {
    //console.log(self.firebaseConfig);
    return self.firebaseConfig;
  }

}
