import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { refreshDataTable } from '../../../helpers/datatables.helper';
import { AlertService } from '../../../services/alert.service';
import { NavigationService } from '../../../services/navigation.service';
import { I18nService } from '../../../services/i18n.service';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { Language } from '../../../models/language.model';
import { PagesService } from '../../../services/collections/pages.service';
import { Page } from '../../../models/collections/page.model';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'fa-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.css']
})
export class PagesListComponent implements OnInit, OnDestroy {

  allPages: Observable<Page[]>;
  selectedPage: Page = null;
  @ViewChild(DataTableDirective, {static : false}) private dataTableElement: DataTableDirective;
  dataTableOptions: DataTables.Settings|any = {
    responsive: true,
    aaSorting: []
  };
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();
  private routeParamsChange: Subject<void> = new Subject<void>();
  allLanguages: Language[] = [];
  isLoading: boolean = true;

  constructor(
    private pages: PagesService,
    private alert: AlertService,
    private i18n: I18nService,
    private route: ActivatedRoute,
    public navigation: NavigationService,
    public currentUser: CurrentUserService,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    // Get all languages
    this.settings.supportedLanguages.forEach((language: Language) => {
      this.allLanguages[language.key] = language;
    });
    // Get route params
    this.subscription.add(
      this.route.params.subscribe((params: { authorId: string }) => {
        this.routeParamsChange.next();
        this.isLoading = true;
        // Get all pages
        this.allPages = this.pages.getWhereFn(ref => {
          let query: any = ref;
          // Filter by author
          if (params.authorId) {
            query = query.where('createdBy', '==', params.authorId);
          }
          //query = query.orderBy('createdAt', 'desc'); // requires an index to work
          return query;
        }, true).pipe(
          map((pages: Page[]) => {
            return pages.sort((a: Page, b: Page) => b.createdAt - a.createdAt);
          }),
          takeUntil(this.routeParamsChange)
        );
        this.subscription.add(
          this.allPages.subscribe((pages: Page[]) => {
            // console.log(pages);
            // Refresh datatable on data change
            refreshDataTable(this.dataTableElement, this.dataTableTrigger);
            this.isLoading = false;
          })
        );
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
    this.routeParamsChange.next();
  }

  deletePage(page: Page) {
    this.pages.delete(page.id, {
      lang: page.lang,
      translationId: page.translationId,
      translations: page.translations
    }).then(() => {
      this.alert.success(this.i18n.get('PageDeleted', { title: page.title }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

}
