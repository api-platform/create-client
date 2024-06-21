import {AsyncPipe, NgIf} from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {ApiItem} from "@interface/api";

@Component({
  selector: 'app-form-{{lc}}',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    DeleteComponent
  ],
  templateUrl: './form.component.html',
})
export class FormComponent {
  @Input() item!: ApiItem;
  @Output() submit = new EventEmitter()
  @Output() delete = new EventEmitter()

  handleSubmit() {
    this.submit.emit()
  }

  handleDelete() {
    this.delete.emit(this.item?.["@id"])
  }
}
