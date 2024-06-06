import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  @Input() fields: Array<{ name: string; type: string }> = [];
  @Output() submit = new EventEmitter
  public formGroup: FormGroup = new FormGroup<any>({})

  ngOnInit() {
    this.formGroup = this.createFormGroup()
  }

  createFormGroup() {
    const group: { [key: string]: FormControl<string | null> } = {}

    this.fields.forEach(field => {
      group[field.name] = new FormControl('')
    })
    return new FormGroup(group)
  }

  handleSubmit() {
    this.submit.emit(this.formGroup.value)
  }
}
