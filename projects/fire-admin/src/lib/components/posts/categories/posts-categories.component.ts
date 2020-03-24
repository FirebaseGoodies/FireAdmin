import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { Language } from '../../../models/language.model';
import { slugify } from '../../../helpers/functions.helper';
import { CategoriesService } from '../../../services/collections/categories.service';
import { AlertService } from '../../../services/alert.service';
import { I18nService } from '../../../services/i18n.service';
import { Category } from '../../../models/collections/category.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { map } from 'rxjs/operators';
import { refreshDataTable } from '../../../helpers/datatables.helper';

@Component({
  selector: 'fa-posts-categories',
  templateUrl: './posts-categories.component.html',
  styleUrls: ['./posts-categories.component.css']
})
export class PostsCategoriesComponent implements OnInit, OnDestroy {

  label: string;
  slug: string;
  language: string;
  languages: Language[];
  allLanguages: Language[] = [];
  allCategories: Observable<Category[]>;
  selectedCategory: Category = null;
  @ViewChild(DataTableDirective, {static : false}) private dataTableElement: DataTableDirective;
  dataTableOptions: DataTables.Settings|any = {
    responsive: true,
    aaSorting: []
  };
  dataTableTrigger: Subject<void> = new Subject();
  private subscription: Subscription = new Subscription();

  constructor(
    private settings: SettingsService,
    private categories: CategoriesService,
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
    // Get all categories
    this.allCategories = this.categories.getAll().pipe(map((categories: Category[]) => {
      return categories.sort((a: Category, b: Category) => b.createdAt - a.createdAt);
    }));
    this.subscription.add(
      this.allCategories.subscribe((categories: Category[]) => {
        // console.log(categories);
        // Refresh datatable on data change
        refreshDataTable(this.dataTableElement, this.dataTableTrigger, true);
      })
    );
  }

  ngOnDestroy() {
    this.dataTableTrigger.unsubscribe();
    this.subscription.unsubscribe();
  }

  onAddCategoryLabelInput() {
    this.slug = slugify(this.label);
  }

  addCategory(event: Event) {
    (event.target as any).disabled = true;
    this.categories.add({
      label: this.label,
      slug: this.slug,
      lang: this.language
    }).then(() => {
      this.alert.success(this.i18n.get('CategoryAdded'), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    }).finally(() => {
      this.label = this.slug = '';
    });
  }

  deleteCategory(category: Category) {
    this.categories.delete(category.id).then(() => {
      this.alert.success(this.i18n.get('CategoryDeleted', { label: category.label }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

  onEditCategoryLabelInput() {
    this.selectedCategory.slug = slugify(this.selectedCategory.label);
  }

  editCategory(category: Category) {
    this.categories.edit(category.id, category).then(() => {
      this.alert.success(this.i18n.get('CategorySaved', { label: category.label }), false, 5000);
    }).catch((error: Error) => {
      this.alert.error(error.message);
    });
  }

  setSelectedCategory(category: Category) {
    this.selectedCategory = Object.assign({}, category);
  }

}
