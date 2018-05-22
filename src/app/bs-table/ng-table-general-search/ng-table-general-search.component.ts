import {Component, OnInit, Optional} from '@angular/core';
import {NgTableComponent} from "../ng-table/ng-table.component";
import {NgSdTableComponent} from "../ng-sd-table/ng-sd-table.component";
import {isNullOrUndefined} from "util";
import {take} from "rxjs/internal/operators";

@Component({
  selector: 'es-ng-table-general-search',
  templateUrl: './ng-table-general-search.component.html',
  styleUrls: ['./ng-table-general-search.component.css']
})
export class NgTableGeneralSearchComponent implements OnInit {
  searchTerm: string = "";
  table: NgTableComponent | NgSdTableComponent;
  constructor(
    @Optional() private ngTableComponent: NgTableComponent,
    @Optional() private ngSdTableComponent: NgSdTableComponent
  ) { }

  ngOnInit() {
    this.table = isNullOrUndefined(this.ngTableComponent)? this.ngSdTableComponent: this.ngTableComponent;
    this.table.search$
      .pipe(take(1))
      .subscribe((term) =>this.searchTerm = term);
  }

  search(searchTerm: string){
    this.table.generalSearch(searchTerm);
  }

}
