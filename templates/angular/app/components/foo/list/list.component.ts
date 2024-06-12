import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AsyncPipe, Location, NgFor, NgIf} from "@angular/common";
import {TableComponent} from "../../common/table/table.component";
import {ApiService} from "../../../service/api.service";
import {Hero} from "../../../interface/hero.model";
import {DeleteComponent} from "../../common/delete/delete.component";

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
  public items: WritableSignal<Hero[] | []> = signal([])
  public isLoading = signal(false)
  public error = signal(undefined)
  public bulk: WritableSignal<Array<string>> = signal([])

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.isLoading.set(true)
    this.apiService
      .getData('/{{lc}}')
      .subscribe(
        (items) => {
          this.items.set(items['hydra:member'])
          this.isLoading.set(false)
        }
      )
  }

  addToBulk(id: string) {
    if (this.isInBulkList(id)) {
      const bulkFilter = this.bulk().filter(element => element !== id)
      return this.bulk.set(bulkFilter)
    }

    this.bulk.update(uri => [...uri, id])
  }

  selectedAll() {
    if (!this.bulk().length) {
      this.items().forEach(item => {
        this.bulk().push(<string>item["@id"])
      })
    } else {
      this.bulk.set([])
    }
  }

  delete() {
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

  private isInBulkList(id: string): boolean {
    return this.bulk().includes(id)
  }
}
