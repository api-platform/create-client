import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Hero} from "../../../interface/hero.model";
import {FormsModule} from "@angular/forms";
import {ShowComponent} from "../../svg/show/show.component";
import {ShowSvgComponent} from "../../svg/show-svg/show-svg.component";
import {EditSvgComponent} from "../../svg/edit-svg/edit-svg.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ShowComponent,
    ShowSvgComponent,
    EditSvgComponent
  ],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() items!: Hero[];
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
