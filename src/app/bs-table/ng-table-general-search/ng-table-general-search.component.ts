import {Component, Inject, OnInit, Optional} from '@angular/core';
import {NgTableComponent} from "../ng-table/ng-table.component";
import {NgSdTableComponent} from "../ng-sd-table/ng-sd-table.component";
import {isNullOrUndefined} from "util";
import {take} from "rxjs/internal/operators";
import {NG_TABLE_TOKEN, NgTable} from "../ng-table-token";

@Component({
  selector: 'es-ng-table-general-search',
  templateUrl: './ng-table-general-search.component.html',
  styleUrls: ['./ng-table-general-search.component.css']
})
export class NgTableGeneralSearchComponent implements OnInit {
  searchTerm: string = "";

  constructor(
    @Inject(NG_TABLE_TOKEN) private table: NgTable
  ) { }

  ngOnInit() {
    this.table.search$
      .pipe(take(1))
      .subscribe((term) =>this.searchTerm = term);
  }

  search(searchTerm: string){
    this.table.generalSearch(searchTerm);
  }

}
