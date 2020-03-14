import { Component, OnInit } from '@angular/core';
import { slugify } from '../../../helpers/functions.helper';
import { Language } from '../../../models/language.model';
import { SettingsService } from '../../../services/settings.service';
import { PageBlock, PageBlockType } from '../../../models/collections/page.model';
import { I18nService } from '../../../services/i18n.service';

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
    private i18n: I18nService
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

}
