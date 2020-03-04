import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/internal/Subject';

export function refreshDataTable(dataTableElement: DataTableDirective, dataTableTrigger: Subject<void>) {
  if (dataTableElement.dtInstance) {
    dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      dataTableTrigger.next();
    });
  } else {
    dataTableTrigger.next();
  }
}
