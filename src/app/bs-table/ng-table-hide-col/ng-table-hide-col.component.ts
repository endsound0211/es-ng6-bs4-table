import {AfterContentChecked, Component, Inject} from '@angular/core';
import {NG_TABLE_TOKEN, NgTable} from '../ng-table-token';
import {NgTableColComponent} from '..';

@Component({
  selector: 'es-ng-table-hide-col',
  templateUrl: './ng-table-hide-col.component.html',
  styleUrls: ['./ng-table-hide-col.component.css']
})
export class NgTableHideColComponent implements AfterContentChecked {
  cols: Array<NgTableColComponent>;

  constructor(@Inject(NG_TABLE_TOKEN) private table: NgTable) { }

  ngAfterContentChecked(): void {
    this.cols = this.table.cols.toArray();
  }

  toggleColumn(col: NgTableColComponent){
    col.toggle();
  }

}
