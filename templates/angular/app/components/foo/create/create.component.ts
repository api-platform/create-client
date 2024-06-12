import {Component, signal, WritableSignal} from '@angular/core';
import {DeleteComponent} from "../../common/delete/delete.component";
import {RouterLink} from "@angular/router";
import {ApiService} from "../../../service/api.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import {FormComponent} from "../../common/form/form.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    DeleteComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    FormComponent
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  public isLoading: WritableSignal<boolean> = signal(false)
  public formType ='{{formFields}}'

  constructor(private apiService: ApiService, private location: Location) {
  }
  onSubmit(data: any) {
    return this.apiService
      .add('/{{lc}}',
        {
          ...data
        }
      ).subscribe(
        (item) => {
          this.isLoading.set(true)
          this.location.back()
        }
      )
  }
}
