import {AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NG_TABLE_TOKEN, NgTable} from '../ng-table-token';
import {NG_TABLE_I18N, NgTableI18nService} from '../locale/ng-table-i18n.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {isNullOrUndefined} from 'util';
import {NgTableColComponent} from '../ng-table-col/ng-table-col.component';

@Component({
  selector: 'es-ng-table-advanced-search',
  templateUrl: './ng-table-advanced-search.component.html',
  styleUrls: ['./ng-table-advanced-search.component.css']
})
export class NgTableAdvancedSearchComponent implements OnInit, AfterViewInit {
  @ViewChild('advancedSearchModal')advancedSearchModalTemplateRef: TemplateRef<any>;
  advancedSearchModalRef: NgbModalRef;

  cols: Array<NgTableColComponent>;
  query: any = {};

  constructor(
    @Inject(NG_TABLE_TOKEN) private table: NgTable,
    @Inject(NG_TABLE_I18N) private ngTableI18nService: NgTableI18nService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
   this.table.query$
     .subscribe((query) => this.query = query);
  }

  ngAfterViewInit(): void {
    this.cols = this.table.cols.filter((col) => !col.checkbox && !col.radio);
  }

  openModel(): void {
    if (isNullOrUndefined(this.advancedSearchModalRef)) {
      this.advancedSearchModalRef = this.ngbModal.open(this.advancedSearchModalTemplateRef, {windowClass: 'advanced-search-modal'});
      this.advancedSearchModalRef.result.then((result) => {
        this.table.advancedSearch(this.query);
        this.advancedSearchModalRef = null;
      }, (reason) => this.advancedSearchModalRef = null);
    }
  }

  formatSearch = () => {
    return this.ngTableI18nService.formatSearch();
  }

  formatAdvancedSearch = () => {
    return this.ngTableI18nService.formatAdvancedSearch();
  }
}
