import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTableComponent } from './ng-table/ng-table.component';
import { NgTableColComponent } from './ng-table-col/ng-table-col.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import { NgSdTableComponent } from './ng-sd-table/ng-sd-table.component';
import { NgTableGeneralSearchComponent } from './ng-table-general-search/ng-table-general-search.component';
import { TemplateTypePipe } from './template-type.pipe';
import { NgTableToolBarComponent } from './ng-table-tool-bar/ng-table-tool-bar.component';




@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    FormsModule
  ],
  declarations: [
    NgTableComponent,
    NgTableColComponent,
    NgSdTableComponent,
    NgTableGeneralSearchComponent,
    TemplateTypePipe,
    NgTableToolBarComponent,
  ],
  exports: [
    NgTableComponent,
    NgTableColComponent,
    NgSdTableComponent,
    NgTableToolBarComponent,
    NgTableGeneralSearchComponent,
  ]
})
export class BsTableModule { }
