import {
  Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef,
  ViewChild
} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'es-ng-table-col',
  templateUrl: './ng-table-col.component.html',
  styleUrls: ['./ng-table-col.component.css']
})
export class NgTableColComponent implements OnInit {

  @Input()title: string;
  @Input()field: string;

  @Input() checkbox = false;
  @Input() radio = false;
  @Input() hidden = false;

  @Input() classArray = [];

  @Input()formatter = (value: any) => {
      return value ? value + '' : '-';
  }
  @ViewChild('textTemplate')  defaultTextTemplate: TemplateRef<any>;
  @ContentChild('textTemplate')textTemplate: TemplateRef<any>;

  @ViewChild('editTemplate')  defaultEditTemplate: TemplateRef<any>;
  @ContentChild('editTemplate')editTemplate: TemplateRef<any>;

  @Output() onCellClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (isNullOrUndefined(this.textTemplate)) {this.textTemplate = this.defaultTextTemplate; }
    if (isNullOrUndefined(this.editTemplate)) {this.editTemplate = this.defaultEditTemplate; }
  }

  hide(): void {
    this.hidden = true;
  }

  show(): void {
    this.hidden = false;
  }

  toggle(): void {
    this.hidden = !this.hidden;
  }

  get classString(): string {
    return this.classArray.join(' ');
  }

}
