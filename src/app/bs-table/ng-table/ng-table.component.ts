import {
  AfterViewInit,
  Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, Optional,
  Output,
  QueryList
} from '@angular/core';
import {NgTableColComponent} from '../ng-table-col/ng-table-col.component';
import {from} from 'linq/linq';
import {Subscription, BehaviorSubject, Observable} from 'rxjs';
import {from as _from, combineLatest as _combineLatest} from 'rxjs';
import {filter, switchMap, map, take, skip, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {isNullOrUndefined, isObject} from 'util';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {TD_TEMPLATE} from '../template-type.pipe';
import {NG_TABLE_TOKEN, NgTable} from '../ng-table-token';
import {NG_TABLE_I18N, NgTableI18nService} from '../locale/ng-table-i18n.service';


@Component({
  selector: 'es-ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.css'],
  providers: [
    {provide: NG_TABLE_TOKEN, useExisting: forwardRef(() => NgTableComponent), multi: false}
  ]
})
export class NgTableComponent implements NgTable, OnInit, AfterViewInit,  OnDestroy {
  TD_TEMPLATE = TD_TEMPLATE;

  // basic
  data$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  @Input()
  set data(value: Array<any>) {this.data$.next(value); }
  get data(): Array<any> { return this.data$.getValue(); }
  rows$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  @Input()
  set rows(value: Array<any>) {this.rows$.next(value); }
  get rows(): Array<any> { return this.rows$.getValue(); }

  @ContentChildren(NgTableColComponent)
  cols: QueryList<NgTableColComponent>;
  total = 0;

  // pagination
  page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  set page(value: number) { this.page$.next(value); }
  get page(): number { return this.page$.getValue(); }
  size$: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  set size(value: number) {this.size$.next(value); }
  get size(): number { return this.size$.getValue(); }
  sizeList: Array<number> = [10, 25, 50, 100];

  // search
  search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  set search(term: string) {this.search$.next(term); }
  get search(): string {return this.search$.getValue(); }
  searchSub: Subscription;
  @Input()
  searchFun = (row: any, cols: Array<NgTableColComponent>, term: string) =>
    !from(cols).where((col) => col.formatter(row[col.field]).toString().includes(term)).isEmpty()
  query$ = new BehaviorSubject<{[key: string]: any}>({});
  @Input()
  set query(value: {[key: string]: any}) {this.query$.next(value); }
  get query(): {[key: string]: any} {return this.query$.getValue(); }
  querySub: Subscription;
  @Input()
  queryFun = (row: any, index: number, query: any) => {
    return !from(query)
      .where((field) => {
        if (field.value === '') {
          return true;
        }

        const formatter = from(this.cols.toArray())
          .where((col) => col.field === field.key)
          .select((col) => col.formatter)
          .defaultIfEmpty((value) => value + '').first();
         return  formatter(row[field.key]).toString().includes(field.value.toString()); }
      ).isEmpty();
  }


  // orderBy
  orderBySub: Subscription;
  sort$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get sort(): string {return this.sort$.getValue(); }
  @Input()
  set sort(value: string) {this.sort$.next(value); }
  order$: BehaviorSubject<'desc' | 'asc'> = new BehaviorSubject<'desc' | 'asc'>('asc');
  get order() {return this.order$.getValue(); }
  @Input()
  set order(value) {this.order$.next(value); }

  // refresh
  refresh$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  refreshSub: Subscription;

  // http async
  url$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  httpSub: Subscription;
  @Input()
  set url(value: string) {this.url$.next(value); }
  get url(): string {return this.url$.getValue(); }


  // keep
  @Input() keep = false;
  keepSub: Subscription;
  params$ = _combineLatest(
    this.refresh$, this.page$, this.size$, this.sort$, this.order$, this.search$, this.query$,
    (refresh, offset, limit, sort, order, search, query) => {
      const params = {
        offset: this.startIndex,
        limit: limit,
        order: order
      };
      if (sort) { params['sort'] = sort; }
      if (search) { params['search'] = search; }
      if (!isNullOrUndefined(query) && isObject(query) && Object.keys(query).length > 0) { params['query'] = JSON.stringify(query); }

      return params;
    }).pipe(debounceTime(500));
    // .distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y));
  @Output()
  onInitKeepParams = new EventEmitter<any>();

  // loading;
  isLoading = false;

  // event
  @Output()
  onRowClick = new EventEmitter<any>();

  // handler
  @Input()
  responseHandler = (data: any): any => {
    return data;
  }

  constructor(
    protected http: HttpClient,
    @Optional() protected router: Router,
    @Optional() protected route: ActivatedRoute,
    @Inject(NG_TABLE_I18N)protected ngTableI18nService: NgTableI18nService
  ) { }

  ngOnInit() {
    if (this.keep) { this.keepConfigure(); }

    // order
    this.orderBySub = _combineLatest(
      this.sort$.pipe(
        skip(1),
        filter((sort) => sort !== '')
      ), this.order$,
      (sort, order) => ({sort: sort, order: order})
    ).subscribe((orderInfo) => this.orderBy(orderInfo.sort, orderInfo.order));

    // search
    this.searchSub = this.search$
      .pipe(
        skip(1),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((term) => {
        const rows = this.searchData(term);
        this.initRows(rows, rows.length);
        this.sort = this.sort;
      });

    // query
    this.querySub = this.query$
      .pipe(
        skip(1),
        filter((query) => !isNullOrUndefined(query)),
        debounceTime(500)
      ).subscribe((query) => {
        const rows = this.queryData(query);
        this.initRows(rows, rows.length);
        this.sort = this.sort;
      });

    // http
    this.httpSub = this.url$
      .pipe(
        filter((url) => !isNullOrUndefined(url) && Boolean(url)),
        tap((url) => this.isLoading = true),
        switchMap((url) => this.http.get<Array<any>>(url)),
        map((data) => this.responseHandler(data))
      ).subscribe((rows) => {
        this.data = rows;
        this.isLoading = false;
      });

    // refresh
    this.refreshSub = this.refresh$
      .pipe(
        filter((r) => r !== 0)
      ).subscribe(r => {
        this.page = 1;
        this.sort = '';
        this.query = {};
        this.search = '';
        this.url = this.url;
    });
  }

  ngAfterViewInit(): void {
    this.data$
      .subscribe((data) => {
        let rows: Array<any>;
        if (!isNullOrUndefined(this.query) && Object.keys(this.query).length > 0) {
          rows = this.queryData(this.query);
        } else if (this.search) {
          rows = this.searchData(this.search);
             } else {
          rows = data;
             }

        this.initRows(rows, rows.length);

        if (this.sort) {
          this.sort = this.sort;
        }

      });
  }


  ngOnDestroy(): void {
    if (!isNullOrUndefined(this.searchSub)) { this.searchSub.unsubscribe(); }
    if (!isNullOrUndefined(this.httpSub)) { this.httpSub.unsubscribe(); }
    if (!isNullOrUndefined(this.keepSub)) { this.keepSub.unsubscribe(); }
    if (!isNullOrUndefined(this.orderBySub)) { this.orderBySub.unsubscribe(); }
    if (!isNullOrUndefined(this.querySub)) { this.querySub.unsubscribe(); }
    if (!isNullOrUndefined(this.refreshSub)) { this.refreshSub.unsubscribe(); }
  }

  initRows(rows: Array<any>, total: number) {
    this.rows = rows;
    this.total = total;
  }

  get startIndex(): number {
    const index = (this.page - 1) * this.size;
    return isNaN(index) ? 0 : index;
  }

  get endIndex(): number { return this.page * this.size; }

  getSelections(field: string): Array<any> {
    return from(this.data).where(row => {
      if (row[field]) {
        return true;
      }
      return false;
    }).toArray();
  }

  checkAll(checked: boolean, field: string) {
    _from(this.rows)
      .pipe(
        skip(this.startIndex),
        take(this.size)
      ).subscribe((row) => row[field] = checked);
  }

  radioChange(row: any, field: string) {
    _from(this.rows)
      .subscribe((r) => r[field] = false);
    row[field] = true;
  }

  toggleOrder(sort: string) {
    if (sort === this.sort) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = sort;
    }
  }

  orderBy(sort: string, order: 'desc' | 'asc') {
    const col = from(this.cols.toArray()).where((c) => c.field === sort).first();
    if (col.checkbox || col.radio) {
      return;
    }

    const formatter = col.formatter;

    if (order === 'asc') {
      this.rows = from(this.rows).orderBy((row) => formatter(row[sort])).toArray();
    } else {
      this.rows = from(this.rows).orderByDescending((row) => formatter(row[sort])).toArray();
    }
  }

  keepConfigure() {
    if (isNullOrUndefined(this.route) || isNullOrUndefined(this.router)) {
      throw new ReferenceError('Import RoutingModule to your module');
    }

    const queryParams =  JSON.parse(JSON.stringify(this.route.snapshot.queryParams));
    if ('sort' in queryParams) { this.sort = queryParams['sort']; }
    if ('search' in queryParams) { this.search = queryParams['search']; }
    if ('limit' in queryParams) { this.size = +queryParams['limit']; }
    if ('offset' in queryParams) { this.page = +queryParams['offset'] / this.size$.getValue() + 1; }
    if ('order' in queryParams) { this.order = queryParams['order']; }
    if ('query' in queryParams && queryParams['query']) {
      queryParams['query'] = JSON.parse(queryParams['query']);
      this.query = queryParams['query'];
    }

    this.onInitKeepParams.emit({
      sort: this.sort,
      search: this.search,
      size: this.size,
      page: this.page,
      order: this.order,
      query: this.query
    });

    this.keepSub = this.params$.pipe(skip(1))
      .subscribe((params) => this.router.navigate(['.'], {queryParams: params, relativeTo: this.route, replaceUrl: true}));
  }

  selectSize(size: number) {
    this.page = 1;
    this.size$.next(size);
  }

  generalSearch(term: string) {
    this.page = 1;
    this.search$.next(term);
  }

  advancedSearch(query: any) {
    this.page = 1;
    this.query$.next(query);
  }

  refresh() {
    this.refresh$.next(this.refresh$.getValue() + 1);
  }

  // i18n
  formatAfterPerPage = () => this.ngTableI18nService.formatAfterPerPage();
  formatBeforePerPage = () => this.ngTableI18nService.formatBeforePerPage();
  formatShowingRows = (f: number, to: number, total: number) => this.ngTableI18nService.formatShowingRows(f, to , total);
  formatLoading = () => this.ngTableI18nService.formatLoading();

  // hide
  hideColumn(col: NgTableColComponent): void {
    col.hide();
  }

  showColumn(col: NgTableColComponent): void {
    col.show();
  }

  toggleColumn(col: NgTableColComponent): void {
    col.toggle();
  }

  hideColumnByIndex(index: number): void {
    if (index >= this.cols.length) { return; }
    this.cols.toArray()[index].hide();
  }

  showColumnByIndex(index: number): void {
    if (index >= this.cols.length) { return; }
    this.cols.toArray()[index].show();
  }

  toggleColumnByIndex(index: number): void {
    if (index >= this.cols.length) { return; }
    this.cols.toArray()[index].toggle();
  }

  hideColumnByField(field: string): void {
    this.cols.toArray().filter((col) => col.field === field)
      .forEach((col) => col.hide());
  }

  showColumnByField(field: string): void {
    this.cols.toArray().filter((col) => col.field === field)
      .forEach((col) => col.show());
  }

  toggleColumnByField(field: string): void {
    this.cols.toArray().filter((col) => col.field === field)
      .forEach((col) => col.show());
  }

  private searchData(term: string): Array<any> {
    return term ?
      from(this.data).where((row) => this.searchFun(row, this.cols.toArray(), term)).toArray() :
      this.data;
  }

  private queryData(query: any): Array<any> {
    return Object.keys(query).length > 0 ?
      from(this.data).where((row, index) => this.queryFun(row, index, query)).toArray() :
      this.data;
  }
}
