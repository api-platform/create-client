import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
})
export class DeleteComponent {
  @Input() disabled!: boolean
  @Output() delete: EventEmitter<Function> = new EventEmitter<Function>()

  deleteAction () {
    return this.delete.emit()
  }
}
