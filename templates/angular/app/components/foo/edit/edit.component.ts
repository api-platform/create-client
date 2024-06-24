import {CommonModule, Location} from "@angular/common"
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core'
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {Router, RouterLink} from "@angular/router"
import {AlertComponent} from "@components/common/alert/alert.component"
import {BackToListComponent} from "@components/common/back-to-list/back-to-list.component"
import {DeleteComponent} from "@components/common/delete/delete.component"
import {FormComponent} from "@components/{{lc}}/form/form.component"
import {ApiItem, SubmissionErrors} from "@interface/api"
import {ApiService} from "@service/api.service"

@Component({
  selector: 'app-edit-{{lc}}',
  standalone: true,
  imports: [
    AlertComponent,
    BackToListComponent,
    CommonModule,
    DeleteComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    FormComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  public item: WritableSignal<ApiItem> = signal({} as ApiItem);
  public isLoading: WritableSignal<Boolean> = signal(false)
  public error: WritableSignal<SubmissionErrors | null> = signal(null)
  private destroy: DestroyRef = inject(DestroyRef)
  private apiService: ApiService = inject(ApiService)
  private router: Router = inject(Router)
  private location: Location = inject(Location)

  ngOnInit() {
    this.fetchData()
  }

  public fetchData() {
    const uri = this.router.url.split("/edit")[0]
    this.toggleIsLoading()
    this.apiService
      .fetchData(uri)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (value) => {
          this.item.set(value)
        },
        error: err => this.error.set(err)
      })
    this.toggleIsLoading()
  }

  public onSubmit(data: any) {
    return this.apiService
      .put(this.item()["@id"]!, this.item())
      .subscribe({
        next: () => this.location.back(),
        error: err => this.error.set(err)
      })
  }

  public delete() {
    return this.apiService
      .delete(this.item()["@id"]!)
      .subscribe({
        next: () => this.location.back(),
        error: err => this.error.set(err)
      })
  }

  private toggleIsLoading() {
    return this.isLoading.update((value) => !value);
  }
}
