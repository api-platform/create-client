import {AsyncPipe} from "@angular/common";
import {Component, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {ShowSvgComponent} from "@components/svg/show-svg/show-svg.component";
import {EditSvgComponent} from "@components/svg/edit-svg/edit-svg.component";
import {ApiItem} from "@interface/api";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ShowSvgComponent,
    EditSvgComponent,
    AsyncPipe
  ],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() items!: WritableSignal<ApiItem[]>;
  @Input() bulk!: Array<string>;
  @Output() addToBulkList = new EventEmitter<string>()
  @Output() selectedAll = new EventEmitter<Function>()


  addToBulk(id: string) {
    this.addToBulkList.emit(id)
  }

  selected() {
    this.selectedAll.emit()
  }
}
