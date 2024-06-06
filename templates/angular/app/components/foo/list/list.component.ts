import {Component, computed, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AsyncPipe, Location, NgFor, NgIf} from "@angular/common";
import {TableComponent} from "../../common/table/table.component";
import {ApiService} from "../../../service/api.service";
import {Hero} from "../../../interface/hero.model";
import {DeleteComponent} from "../../common/delete/delete.component";
import {log} from "node:util";
import {Validators} from "@angular/forms";

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
  public heroes: WritableSignal<Hero[] | []> = signal([])
  public isLoading = signal(false)
  public error = signal(undefined)
  @Output() bulk: WritableSignal<Array<string>> = signal([])

  constructor(
    private heroService: ApiService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.isLoading.set(true)
    this.heroService
      .getDataes('/heroes')
      .subscribe(
        (items) => {
          this.heroes.set(items['hydra:member'])
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
      this.heroes().forEach(hero => {
        this.bulk().push(<string>hero["@id"])
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
              this.heroService.delete(uri)
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
