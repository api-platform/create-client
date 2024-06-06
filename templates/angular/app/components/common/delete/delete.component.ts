import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ApiService} from "../../../service/api.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
})
export class DeleteComponent {
  @Input() disabled!: boolean
  @Output() delete: EventEmitter<Function> = new EventEmitter<Function>()
  constructor(
    private heroService: ApiService,
    private location: Location
  ) {
  }

  deleteAction () {
    return this.delete.emit()
  }
}
