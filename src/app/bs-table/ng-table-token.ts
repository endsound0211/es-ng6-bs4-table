import {EventEmitter, InjectionToken, QueryList} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {NgTableColComponent} from './ng-table-col/ng-table-col.component';

export const NG_TABLE_TOKEN = new InjectionToken<NgTable>('NgTable');

export interface NgTable {
  // basic
  data$: BehaviorSubject<Array<any>>;
  data: Array<any>;
  rows$: BehaviorSubject<Array<any>>;
  rows: Array<any>;
  cols: QueryList<NgTableColComponent>;
  total: number;

  // pagination
  page$: BehaviorSubject<number>;
  page: number;
  size$: BehaviorSubject<number>;
  size: number;
  sizeList: Array<number>;

  // search
  search$: BehaviorSubject<string>;
  search: string;
  query$: BehaviorSubject<{[key: string]: any}>;
  query: {[key: string]: any};

  // order by
  sort$: BehaviorSubject<string>;
  sort: string;
  order$: BehaviorSubject<'desc' | 'asc'>;
  order: 'desc' | 'asc';

  // http async
  url$: BehaviorSubject<string>;
  url: string;
  params$: Observable<any>;

  // event
  onRowClick: EventEmitter<any>;
  onInitKeepParams: EventEmitter<any>;


  initRows(rows: Array<any>, total: number): void;
  getSelections(field: string): Array<any>;
  checkAll(checked: boolean, field: string): void;
  radioChange(row: any, field: string): void;
  toggleOrder(sort: string): void;
  orderBy(sort: string, order: 'desc' | 'asc');
  selectSize(size: number);
  generalSearch(term: string): void;
  advancedSearch(query: any): void;
  refresh(): void;

  // hide
  hideColumn(col: NgTableColComponent): void;
  showColumn(col: NgTableColComponent): void;
  toggleColumn(col: NgTableColComponent): void;
  hideColumnByIndex(index: number): void;
  showColumnByIndex(index: number): void;
  toggleColumnByIndex(index: number): void;
  hideColumnByField(field: string): void;
  showColumnByField(field: string): void;
  toggleColumnByField(field: string): void;
}
