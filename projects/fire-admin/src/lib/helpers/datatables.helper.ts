import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/internal/Subject';

export function refreshDataTable(dataTableElement: DataTableDirective, dataTableTrigger: Subject<void>) {
  clearDataTable(dataTableElement).then(() => {
    dataTableTrigger.next();
  });
}

export function clearDataTable(dataTableElement: DataTableDirective) {
  return new Promise((resolve, reject) => {
    if (dataTableElement.dtInstance) {
      dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        if (dtInstance.data().any()) {
          dtInstance.clear().destroy();
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}
