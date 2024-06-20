import {Location} from "@angular/common";
import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {FormComponent} from "@components/{{lc}}/form/form.component";
import {ApiService} from "@service/api.service";

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
  private apiService: ApiService = inject(ApiService)
  private location: Location = inject(Location)
  public isLoading: WritableSignal<boolean> = signal(false)

  public formType: Array<{ name: string; type: string }> = [
    {
      name: 'name',
      type: 'string',
    }
  ]

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
