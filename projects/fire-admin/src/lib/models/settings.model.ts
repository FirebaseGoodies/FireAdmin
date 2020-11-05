import { Language } from './language.model';

export type SidebarStyle = 'expanded' | 'collapsed' | 'headerbar';

export interface Settings {
  language: string;
  sidebarStyle: SidebarStyle;
  supportedLanguages: Language[];
}
