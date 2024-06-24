import {
  Component,
  EventEmitter,
  Input,
  Output,
  WritableSignal
} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {ShowSvgComponent} from "@components/common/svg/show-svg/show-svg.component";
import {EditSvgComponent} from "@components/common/svg/edit-svg/edit-svg.component";
import {ApiItem} from "@interface/api";
import {formatDateTime} from "@utils/date";

@Component({
  selector: 'app-table-{{lc}}',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ShowSvgComponent,
    EditSvgComponent
  ],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() items!: WritableSignal<ApiItem[]>;
  @Input() bulk!: Array<string>;
  @Output() addToBulkList = new EventEmitter<string>()
  @Output() selectedAll = new EventEmitter<Function>()
  protected readonly formatDateTime = formatDateTime;

  addToBulk(id: string) {
    this.addToBulkList.emit(id)
  }

  selected() {
    this.selectedAll.emit()
  }
}
