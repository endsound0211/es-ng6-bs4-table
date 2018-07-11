import {Injectable} from "@angular/core";
import {NgTableI18nService} from "./ng-table-i18n.service";

@Injectable()
export class NgTableZhTwService implements NgTableI18nService{
  formatShowingRows = (from: number, to: number, total: number) => {
    return `顯示第 ${from} 到第 ${to} 項記錄，總共 ${total} 項記錄`;
  };
  formatBeforePerPage = () => {
    return `每頁顯示`;
  };
  formatAfterPerPage = () => {
    return `項記錄`;
  };
  formatSearch = () => {
    return `搜尋`;
  };
  formatAdvancedSearch = () => {
    return `進階搜尋`;
  };
}
