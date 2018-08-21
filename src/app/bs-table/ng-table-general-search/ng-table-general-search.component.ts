import {Component, Inject, OnInit} from '@angular/core';
import {NG_TABLE_TOKEN, NgTable} from '../ng-table-token';
import {NG_TABLE_I18N, NgTableI18nService} from '../locale/ng-table-i18n.service';

@Component({
  selector: 'es-ng-table-general-search',
  templateUrl: './ng-table-general-search.component.html',
  styleUrls: ['./ng-table-general-search.component.css']
})
export class NgTableGeneralSearchComponent implements OnInit {
  searchTerm = '';

  constructor(
    @Inject(NG_TABLE_TOKEN) private table: NgTable,
    @Inject(NG_TABLE_I18N)protected ngTableI18nService: NgTableI18nService
  ) { }

  ngOnInit() {
    this.table.search$
      .subscribe((term) => this.searchTerm = term);
  }

  search(searchTerm: string) {
    this.table.generalSearch(searchTerm);
  }

  formatSearch = () => {
    return this.ngTableI18nService.formatSearch();
  }
}
