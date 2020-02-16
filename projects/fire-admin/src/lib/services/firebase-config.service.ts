import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from '@angular/fire';

// Firebase config injection token
export const FirebaseConfigService = new InjectionToken<FirebaseOptions>('FirebaseOptions');
