import {AsyncPipe, Location, NgFor, NgIf} from "@angular/common";
import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {TableComponent} from "@components/common/table/table.component";
import {ApiItem} from "@interface/api";
import {ApiService} from "@service/api.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    TableComponent,
    AsyncPipe,
    NgIf,
    DeleteComponent
  ],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  public isLoading: WritableSignal<Boolean> = signal(false)
  public items: WritableSignal<ApiItem[]> = signal([])
  public error: WritableSignal<String> = signal('')
  public bulk: WritableSignal<Array<string>> = signal([])

  private apiService: ApiService = inject(ApiService)
  private location: Location = inject(Location)
  private destroy: DestroyRef = inject(DestroyRef)

  ngOnInit() {
    this.toggleIsLoading()
    this.apiService
      .fetchDataList('/{{lc}}')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(
        (items) => {
          this.items.set(items['hydra:member'])
        }
      )
    this.toggleIsLoading()
  }

  public addToBulk(id: string) {
    if (this.isInBulkList(id)) {
      const bulkFilter =
        this.bulk()
          .filter(element => element !== id)
      return this.bulk.set(bulkFilter)
    }

    this.bulk.update(uri => [...uri, id])
  }

  public selectedAll() {
    if (!this.bulk().length) {
      this.items().forEach(item => {
        this.bulk().push(<string>item["@id"])
      })
    } else {
      this.bulk.set([])
    }
  }

  public delete() {
    Promise.all(this.bulk())
      .then(
        items =>
          items.forEach(
            uri =>
              this.apiService.delete(uri)
                .subscribe(
                  () => {
                    window.location.reload()
                  }
                )
          )
      )
  }

  private toggleIsLoading() {
    return this.isLoading.update(value => !value)
  }

  private isInBulkList(id: string): boolean {
    return this.bulk().includes(id)
  }
}
