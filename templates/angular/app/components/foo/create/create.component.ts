import {Location} from "@angular/common";
import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AlertComponent} from "@components/common/alert/alert.component"
import {BackToListComponent} from "@components/common/back-to-list/back-to-list.component";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {FormComponent} from "@components/{{lc}}/form/form.component";
import {ApiItem, SubmissionErrors} from "@interface/api";
import {ApiService} from "@service/api.service";

@Component({
  selector: 'app-create-{{lc}}',
  standalone: true,
  imports: [
    AlertComponent,
    BackToListComponent,
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
  public item: WritableSignal<ApiItem> = signal({} as ApiItem)
  public isLoading: WritableSignal<boolean> = signal(false)
  public error: WritableSignal<SubmissionErrors | null> = signal(null)

  onSubmit(data: any) {
    return this.apiService
      .add("/books", this.item())
      .subscribe({
        next: () => {
          this.isLoading.set(true)
          this.location.back()
        },
        error: (err: SubmissionErrors) => this.error.set(err)
      })
  }
}
