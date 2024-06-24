import {CommonModule, Location} from "@angular/common";
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router, RouterLink} from "@angular/router";
import {BackToListComponent} from "@components/common/back-to-list/back-to-list.component";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {ApiService} from "@service/api.service";
import {ApiItem} from "@interface/api";
import {formatDateTime} from "@utils/date";

@Component({
  selector: 'app-show-{{lc}}',
  standalone: true,
  imports: [
    BackToListComponent,
    CommonModule,
    DeleteComponent,
    RouterLink
  ],
  templateUrl: './show.component.html',
})
export class ShowComponent implements OnInit {
  private apiService: ApiService = inject(ApiService)
  private router: Router = inject(Router)
  private location: Location = inject(Location)
  private destroy: DestroyRef = inject(DestroyRef)

  public item: WritableSignal<ApiItem> = signal({} as ApiItem)
  public isLoading: WritableSignal<boolean> = signal(false)
  public error: WritableSignal<string> = signal('')
  protected readonly formatDateTime = formatDateTime;
  ngOnInit() {
    this.toggleIsLoading()
    const id = this.router.url
    this.apiService
      .fetchData(id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(item => this.item.set(item))
    this.toggleIsLoading()
  }

  delete(id: string | undefined | null) {
    return this.apiService.delete(id).subscribe(
      () => this.location.back()
    )
  }

  private toggleIsLoading() {
    return this.isLoading.update(value => !value)
  }
}
