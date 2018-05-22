import {
    AfterViewInit,
    Component, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Optional, Output, QueryList,
    SimpleChanges
} from '@angular/core';
import {NgTableColComponent} from "../ng-table-col/ng-table-col.component";
import {from} from "linq/linq";
import {Subscription, BehaviorSubject} from "rxjs";
import {from as _from, combineLatest as _combineLatest} from "rxjs";
import {filter, switchMap, map, take, skip, debounceTime, distinctUntilChanged} from "rxjs/operators";
import {isNullOrUndefined, isObject} from "util";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {TD_TEMPLATE} from "../template-type.pipe";


@Component({
  selector: 'es-ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.css']
})
export class NgTableComponent implements OnInit, AfterViewInit,  OnDestroy, OnChanges {
  TD_TEMPLATE = TD_TEMPLATE;

  //basic
  @Input() data: Array<any>;
  @Input() rows$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  set rows(value: Array<any>){this.rows$.next(value);}
  get rows(): Array<any>{ return this.rows$.getValue();};
  @ContentChildren(NgTableColComponent) cols: QueryList<NgTableColComponent>;
  total: number;

  //pagination
  page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  set page(value: number){ this.page$.next(value);}
  get page(): number{ return this.page$.getValue();}
  size$: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  set size(value: number){this.size$.next(value);}
  get size(): number{ return this.size$.getValue();}
  sizeList: Array<number> = [10, 25, 50, 100];

  //search
  search$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  set search(term: string){this.search$.next(term);}
  get search(): string{return this.search$.getValue();}
  searchSub: Subscription;
  query$ = new BehaviorSubject<{[key: string]: any}>({});
  @Input()
  set query(value: {[key: string]: any}){this.query$.next(value);}
  get query():{[key: string]: any}{return this.query$.getValue();}
  querySub: Subscription;
  @Input()
  queryFun = (row: any, index: number, query: any) => {
    return !from(query).where((field) => {
      let formatter = from(this.cols.toArray())
        .where((col) => col.field == field.key)
        .select((col) => col.formatter)
        .defaultIfEmpty((value) => value + "").first();
       return  formatter(row[field.key]).toString().includes(field.value.toString())}
      ).isEmpty();
  };


  //orderBy
  orderBySub: Subscription;
  sort$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  get sort(): string {return this.sort$.getValue();}
  @Input()
  set sort(value: string) {this.sort$.next(value);}
  order$: BehaviorSubject<'desc' | 'asc'> = new BehaviorSubject<'desc' | 'asc'>('asc');
  get order() {return this.order$.getValue();}
  @Input()
  set order(value) {this.order$.next(value);}

  //refresh
  refresh$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  //http async
  url$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  httpSub: Subscription;
  @Input()
  set url(value: string) {this.url$.next(value);}
  get url(): string {return this.url$.getValue();}


  //keep
  @Input() keep: boolean = false;
  keepSub: Subscription;
  params$ = _combineLatest(
    this.refresh$, this.page$, this.size$, this.sort$, this.order$, this.search$, this.query$,
    (refresh, offset, limit, sort, order, search, query) => {
      let params = {
        offset: this.startIndex,
        limit: limit,
        order: order
      };
      if(sort) params['sort'] = sort;
      if(search) params['search'] = search;
      if(!isNullOrUndefined(query) && isObject(query) && Object.keys(query).length > 0) params['query'] = JSON.stringify(query);

      return params;
    }).pipe(debounceTime(500));
    // .distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y));

  //loading;
  isLoading: boolean = false;

  //event
  @Output() onRowClick = new EventEmitter<any>();

  //handler
  @Input() responseHandler = (data: any): any => {
    return data;
  };

  constructor(
    protected http: HttpClient,
    @Optional() protected router: Router,
    @Optional() protected route: ActivatedRoute
  ) { }

  ngOnInit() {
    //http
    this.httpSub = this.url$
      .pipe(
        filter((url) => !isNullOrUndefined(url) && Boolean(url)),
        switchMap((url) => this.http.get<Array<any>>(url)),
        map((data) => this.responseHandler(data))
      ).subscribe((rows) => {
        this.data = rows;
        this.initRows(rows, rows.length);
      });

    if(this.keep) this.keepConfigure();
  }

  ngAfterViewInit(): void {
    this.rows$
      .pipe(
        filter((rows) => rows.length > 0),
        take(1)
      ).subscribe(() => {
        //order
        this.orderBySub = _combineLatest(
          this.sort$.pipe(filter((sort) => sort != "")), this.order$,
          (sort, order) => {return {sort: sort, order: order}}
        ).subscribe((orderInfo) => this.orderBy(orderInfo.sort, orderInfo.order));

        //search
        this.searchSub = this.search$
          .pipe(
            debounceTime(500),
            distinctUntilChanged()
          ).subscribe((term) => {
            if(term) {
              this.rows = from(this.data).where((row) =>
                !from(this.cols.toArray()).where((col) => col.formatter(row[col.field]).toString().includes(term)).isEmpty()
              ).toArray();
              this.total = this.rows.length;
            }else{
              this.initRows(this.data, this.data.length);
            }
          });

        //query
        this.query$
          .pipe(
            filter((query) => Object.keys(query).length > 0),
            filter((query) => !isNullOrUndefined(query)),
            debounceTime(500)
          ).subscribe((query) => {
            this.rows = from(this.data).where((row, index) => this.queryFun(row, index, query)).toArray();
            this.total = this.rows.length;
            this.page = 1;
          })
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if('data' in changes)
      this.initRows(changes.data.currentValue, changes.data.currentValue.length)

  }

  ngOnDestroy(): void {
    if(!isNullOrUndefined(this.searchSub)) this.searchSub.unsubscribe();
    if(!isNullOrUndefined(this.httpSub)) this.httpSub.unsubscribe();
    if(!isNullOrUndefined(this.keepSub)) this.keepSub.unsubscribe();
    if(!isNullOrUndefined(this.orderBySub)) this.orderBySub.unsubscribe();
    if(!isNullOrUndefined(this.querySub)) this.querySub.unsubscribe();
  }

  initRows(rows: Array<any>, total: number){
    this.rows = rows;
    this.total = total;
  }

  get startIndex(): number{
    let index = (this.page - 1) * this.size;
    return isNaN(index)?0: index;
  }

  get endIndex(): number{ return this.page * this.size;}

  getSelections(field: string): Array<any>{
    return from(this.data).where(row => {
      if(row[field])
        return true;
      return false
    }).toArray()
  }

  checkAll(checked: boolean, field: string){
    _from(this.rows)
      .pipe(
        skip(this.startIndex),
        take(this.size)
      ).subscribe((row) => row[field] = checked);
  }

  radioChange(row: any, field: string){
    _from(this.rows)
      .subscribe((r) => r[field] = false);
    row[field] = true;
  }

  toggleOrder(sort: string){
    if(sort == this.sort)
      this.order = this.order == 'asc'? 'desc': 'asc';
    else
      this.sort = sort;
  }

  orderBy(sort: string, order: 'desc' | 'asc'){
    let col = from(this.cols.toArray()).where((col) => col.field == sort).first();
    if(col.checkbox || col.radio)
      return;

    let formatter = col.formatter;

    if(order == 'asc')
      this.rows = from(this.rows).orderBy((row) => formatter(row[sort])).toArray();
    else
      this.rows = from(this.rows).orderByDescending((row) => formatter(row[sort])).toArray();
  }

  keepConfigure(){
    if(isNullOrUndefined(this.route) || isNullOrUndefined(this.router))
      throw new ReferenceError("Import RoutingModule to your module");

    let queryParams =  JSON.parse(JSON.stringify(this.route.snapshot.queryParams));
    if('sort' in queryParams) this.sort = queryParams['sort'];
    if('search' in queryParams) this.search = queryParams['search'];
    if('limit' in queryParams) this.size = +queryParams['limit'];
    if('offset' in queryParams) this.page = +queryParams['offset'] / this.size$.getValue() + 1;
    if('order' in queryParams) this.order = queryParams['order'];
    if('query' in queryParams && queryParams['query']) {
      queryParams['query'] = JSON.parse(queryParams['query']);
      this.query = queryParams['query'];
    }

    this.keepSub = this.params$.pipe(skip(1))
      .subscribe((params) => this.router.navigate(['.'], {queryParams: params, relativeTo: this.route, replaceUrl: true}))
  }

  selectSize(size: number){
    this.page = 1;
    this.size$.next(size);
  }

  generalSearch(term: string){
    this.page = 1;
    this.search$.next(term);
  }

  advancedSearch(query: any){
    this.page = 1;
    this.query$.next(query);
  }

  refresh(){
    this.refresh$.next(this.refresh$.getValue() + 1);
  }
}
