import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule, Location} from "@angular/common";
import {ApiService} from "../../../service/api.service";
import {DeleteComponent} from "../../common/delete/delete.component";
import {ApiShow} from "../../../interface/api";

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DeleteComponent
  ],
  templateUrl: './show.component.svg',
})
export class ShowComponent implements OnInit {
  public item: WritableSignal<ApiShow|null> = signal(null)
  public isLoading = signal(false)
  public error = signal(undefined)

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.isLoading.set(true)
    const id = this.router.url
    this.apiService
      .getData(id)
      .subscribe(item => {
        this.item.set(item)
        this.isLoading.set(false)
      })
  }

  delete() {
    return this.apiService.delete(this.item()?.['@id']).subscribe(
      () => this.location.back()
    )
  }
}
