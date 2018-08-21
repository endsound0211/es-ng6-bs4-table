import { Pipe, PipeTransform } from '@angular/core';
import {NgTableColComponent} from './ng-table-col/ng-table-col.component';

export enum TD_TEMPLATE{
  TEXT, CHECKBOX, RADIO
};

@Pipe({
  name: 'templateType'
})
export class TemplateTypePipe implements PipeTransform {
  transform(col: NgTableColComponent): any {
    if (col.checkbox) {return TD_TEMPLATE.CHECKBOX; }
    if (col.radio) {return TD_TEMPLATE.RADIO; }
    return TD_TEMPLATE.TEXT;
  }

}
