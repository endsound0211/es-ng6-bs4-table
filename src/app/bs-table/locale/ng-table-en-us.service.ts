import {Injectable} from "@angular/core";
import {NgTableI18nService} from "./ng-table-i18n.service";

@Injectable()
export class NgTableEnUsService implements NgTableI18nService{
  formatShowingRows = (from: number, to: number, total: number) => {
    return `Showing ${from} to ${to} of ${total} rows.`;
  };
  formatBeforePerPage = () => {
    return ` `;
  };
  formatAfterPerPage = () => {
    return ` rows per page`;
  };
  formatSearch = () => {
    return `Search`;
  };
  formatAdvancedSearch = () => {
    return `Advanced Search`
  };
}
