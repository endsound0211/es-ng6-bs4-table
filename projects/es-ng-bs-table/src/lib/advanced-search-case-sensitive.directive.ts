import {Directive, Inject, Input, OnInit} from '@angular/core';
import {NG_TABLE_TOKEN, NgTable} from './ng-table-token';
import {from} from 'linq';

@Directive({
  selector: 'es-ng-table[esAdvancedSearchCaseSensitive]'
})
export class AdvancedSearchCaseSensitiveDirective implements OnInit{
  @Input('esAdvancedSearchCaseSensitive') caseSensitive = true;

  constructor(@Inject(NG_TABLE_TOKEN) private table: NgTable) { }


  ngOnInit(): void {
    if (!this.caseSensitive) {
      this.table.queryFun = (row: any, index: number, query: any) => {
        return !from(query)
          .where((field) => {
            if (field.value === '') {
              return true;
            }

            const formatter = from(this.table.cols.toArray())
              .where((col) => col.field === field.key)
              .select((col) => col.formatter)
              .defaultIfEmpty((value) => value + '').first();
            return  formatter(row[field.key]).toString().toLocaleLowerCase().includes(field.value.toString().toLocaleLowerCase()); }
          ).isEmpty();
      };
    }
  }
}
