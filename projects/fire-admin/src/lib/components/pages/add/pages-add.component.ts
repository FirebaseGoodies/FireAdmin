import { Component, OnInit } from '@angular/core';
import { slugify } from '../../../helpers/functions.helper';
import { Language } from '../../../models/language.model';
import { SettingsService } from '../../../services/settings.service';
import { PageBlock, PageBlockType } from '../../../models/collections/page.model';
import { I18nService } from '../../../services/i18n.service';
import { PagesService } from '../../../services/collections/pages.service';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-pages-add',
  templateUrl: './pages-add.component.html',
  styleUrls: ['./pages-add.component.css']
})
export class PagesAddComponent implements OnInit {

  title: string;
  slug: string;
  language: string;
  languages: Language[];
  blocks: PageBlock[] = [];
  blockTypes: { label: string, value: PageBlockType }[] = [];

  constructor(
    private settings: SettingsService,
    private i18n: I18nService,
    private pages: PagesService,
    private alert: AlertService,
    private navigation: NavigationService
  ) { }

  ngOnInit() {
    this.languages = this.settings.getActiveSupportedLanguages();
    this.language = this.languages[0].key;
    this.blockTypes = Object.keys(PageBlockType).map((key: string) => {
      return { label: key, value: PageBlockType[key] };
    });
    //this.addBlock();
  }

  onTitleInput() {
    this.slug = slugify(this.title).substr(0, 50);
  }

  addBlock(event?: Event) {
    this.blocks.push({
      name: '',
      type: PageBlockType.Text,
      content: ''
    });
  }

  removeBlock(index: number) {
    this.blocks.splice(index, 1);
  }

  onBlockNameInput(block: PageBlock) {
    block.key = slugify(block.name);
  }

  addPage(event: Event) {
    const addButon = event.target as any;
    const startLoading = () => {
      addButon.isLoading = true;
    };
    const stopLoading = () => {
      addButon.isLoading = false;
    };
    startLoading();
    // Check if page slug is duplicated
    this.pages.isSlugDuplicated(this.slug, this.language).then((duplicated: boolean) => {
      if (duplicated) {
        // Warn user about page slug
        this.alert.warning(this.i18n.get('PageSlugAlreadyExists'), false, 5000);
        stopLoading();
      } else {
        // Add page
        this.pages.add({
          lang: this.language,
          title: this.title,
          slug: this.slug,
          blocks: this.pages.formatBlocks(this.blocks)
        }).then(() => {
          this.alert.success(this.i18n.get('PageAdded'), false, 5000, true);
          this.navigation.redirectTo('pages', 'list');
        }).catch((error: Error) => {
          this.alert.error(error.message);
        }).finally(() => {
          stopLoading();
        });
      }
    }).catch((error: Error) => {
      this.alert.error(error.message);
      stopLoading();
    });
  }

}
