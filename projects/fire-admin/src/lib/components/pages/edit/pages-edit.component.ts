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

@Component({
  selector: 'fa-pages-edit',
  templateUrl: './pages-edit.component.html',
  styleUrls: ['./pages-edit.component.css']
})
export class PagesEditComponent implements OnInit, OnDestroy {

  private id: string;
  title: string;
  slug: string;
  language: string;
  blocks: PageBlock[] = [];
  blockTypes: { label: string, value: PageBlockType }[] = [];
  isSubmitButtonsDisabled: boolean = false;
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();

  constructor(
    private i18n: I18nService,
    private pages: PagesService,
    private alert: AlertService,
    public navigation: NavigationService,
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
            this.id = page.id;
            this.title = page.title;
            this.slug = page.slug;
            this.language = page.lang;
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

  savePage(event: Event) {
    const target = event.target as any;
    const startLoading = () => {
      target.isLoading = true;
      this.isSubmitButtonsDisabled = true;
    };
    const stopLoading = () => {
      target.isLoading = false;
      this.isSubmitButtonsDisabled = false;
    };
    startLoading();
    // Check if page slug is duplicated
    this.pages.isSlugDuplicated(this.slug, this.language, this.id).then((duplicated: boolean) => {
      if (duplicated) {
        // Warn user about page slug
        this.alert.warning(this.i18n.get('PageSlugAlreadyExists'), false, 5000);
        stopLoading();
      } else {
        // Edit page
        const data: Page = {
          lang: this.language,
          title: this.title,
          slug: this.slug,
          blocks: this.pages.formatBlocks(this.blocks)
        };
        this.pages.edit(this.id, data).then(() => {
          this.alert.success(this.i18n.get('PageSaved'), false, 5000, true);
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
