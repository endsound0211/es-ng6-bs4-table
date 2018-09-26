import {Directive, Inject, Input, OnInit} from '@angular/core';
import {NG_TABLE_TOKEN, NgTable} from './ng-table-token';
import {NgTableColComponent} from './ng-table-col/ng-table-col.component';
import {from} from 'linq';

@Directive({
  selector: 'es-ng-table[esSearchCaseSensitive]'
})
export class SearchCaseSensitiveDirective implements OnInit {
  @Input('esSearchCaseSensitive') caseSensitive = true;

  constructor( @Inject(NG_TABLE_TOKEN) private table: NgTable) { }

  ngOnInit(): void {
    if (!this.caseSensitive) {
      this.table.searchFun = (row: any, cols: Array<NgTableColComponent>, term: string) =>
        !from(cols).where((col) => col.formatter(row[col.field]).toString().toLocaleLowerCase().includes(term.toLocaleLowerCase())).isEmpty();
    }
  }
}
