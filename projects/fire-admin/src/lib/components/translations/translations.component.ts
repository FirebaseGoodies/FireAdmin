import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Language } from '../../models/language.model';
import { AlertService } from '../../services/alert.service';
import { I18nService } from '../../services/i18n.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { refreshDataTable } from '../../helpers/datatables.helper';
import { TranslationData } from '../../models/collections/translation.model';
import { TranslationsService } from '../../services/collections/translations.service';
import { initPopover } from '../../helpers/layout.helper';

@Component({
  selector: 'fa-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css']
})
export class TranslationsComponent implements OnInit, OnDestroy, AfterViewInit {

  key: string;
  value: string;
  language: string;
  languages: Language[];
  allLanguages: Language[] = [];
  allTranslations: Observable<TranslationData[]>;
  selectedTranslation: TranslationData = null;
  @ViewChild(DataTableDirective, {static : false}) private dataTableElement: DataTableDirective;
  dataTableOptions: DataTables.Settings|any = {
    responsive: true,
    aaSorting: []
  };
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();

  constructor(
    private settings: SettingsService,
    private translations: TranslationsService,
    private alert: AlertService,
    private i18n: I18nService
  ) { }

  ngOnInit() {
    // Get active languages
    this.languages = this.settings.getActiveSupportedLanguages();
    this.language = this.languages[0].key;
    // Get all languages
    this.settings.supportedLanguages.forEach((language: Language) => {
      this.allLanguages[language.key] = language;
    });
    // Get all translations
    this.allTranslations = this.translations.getAll();
    this.subscription.add(
      this.allTranslations.subscribe((translations: TranslationData[]) => {
        // console.log(translations);
        // Refresh datatable on data change
        refreshDataTable(this.dataTableElement, this.dataTableTrigger, true);
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    initPopover('#translations-tooltip');
  }

  addTranslation(event: Event) {
    const addButton = event.target as any;
    addButton.disabled = true;
    // Check if translation key already exists
    this.translations.keyExists(this.key, this.language).then((exists: boolean) => {
      if (exists) {
        // Warn user about existing translation key
        const lang = this.i18n.get(this.allLanguages[this.language].label);
        this.alert.warning(this.i18n.get('TranslationKeyAlreadyExists', { key: this.key, lang: lang }), false, 5000);
        addButton.disabled = false;
      } else {
        this.translations.add({
          key: this.key,
          value: this.value,
          lang: this.language
        }).then(() => {
          this.alert.success(this.i18n.get('TranslationAdded'), false, 5000);
        }).catch((error: Error) => {
          this.alert.error(error.message);
        }).finally(() => {
          this.key = this.value = '';
        });
      }
    });
  }

  deleteTranslation(translation: TranslationData) {
    this.translations.delete(translation.key, translation.lang).then(() => {
      this.alert.success(this.i18n.get('TranslationDeleted', { key: translation.key }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

  editTranslation(translation: TranslationData) {
    this.translations.edit(translation).then(() => {
      this.alert.success(this.i18n.get('TranslationSaved', { key: translation.key }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

  setSelectedTranslation(translation: TranslationData) {
    this.selectedTranslation = Object.assign({}, translation);
  }

}
