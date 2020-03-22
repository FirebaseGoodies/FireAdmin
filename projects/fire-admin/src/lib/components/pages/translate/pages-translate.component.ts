import { Component, OnInit, OnDestroy } from '@angular/core';
import { slugify } from '../../../helpers/functions.helper';
import { PageBlock, PageBlockType, Page } from '../../../models/collections/page.model';
import { I18nService } from '../../../services/i18n.service';
import { PagesService } from '../../../services/collections/pages.service';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Language } from '../../../models/language.model';

@Component({
  selector: 'fa-pages-translate',
  templateUrl: './pages-translate.component.html',
  styleUrls: ['./pages-translate.component.css']
})
export class PagesTranslateComponent implements OnInit, OnDestroy {

  private origin: Page;
  title: string;
  slug: string;
  language: string;
  languages: Language[];
  blocks: PageBlock[] = [];
  blockTypes: { label: string, value: PageBlockType }[] = [];
  isSubmitButtonsDisabled: boolean = false;
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();

  constructor(
    private i18n: I18nService,
    private pages: PagesService,
    private alert: AlertService,
    private navigation: NavigationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.blockTypes = Object.keys(PageBlockType).map((key: string) => {
      return { label: key, value: PageBlockType[key] };
    });
    this.isSubmitButtonsDisabled = true;
    this.subscription.add(
      this.route.params.subscribe((params: { id: string }) => {
        // console.log(params);
        this.pages.get(params.id).pipe(take(1)).toPromise().then((page: Page) => {
          // console.log(page);
          if (page) {
            this.languages = this.pages.getTranslationLanguages(page);
            if (this.languages.length) {
              this.origin = page;
              this.language = this.languages[0].key;
              this.title = page.title;
              this.slug = page.slug;
              this.blocks = Object.keys(page.blocks).map((key: string) => {
                const block: PageBlock = page.blocks[key];
                return {
                  key: key,
                  name: block.name,
                  type: block.type,
                  content: block.content
                };
              });
              this.routeParamsChange.next();
              this.isSubmitButtonsDisabled = false;
            } else {
              this.navigation.redirectTo('pages', 'list');
            }
          } else {
            this.navigation.redirectTo('pages', 'list');
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
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
        this.pages.translate({
          lang: this.language,
          title: this.title,
          slug: this.slug,
          blocks: this.pages.formatBlocks(this.blocks),
          translationId: this.origin.translationId
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
