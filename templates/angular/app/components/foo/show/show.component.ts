import {CommonModule, Location} from "@angular/common";
import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {ApiService} from "@service/api.service";
import {ApiItem} from "@interface/api";

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DeleteComponent
  ],
  templateUrl: './show.component.html',
})
export class ShowComponent implements OnInit {
  private apiService: ApiService = inject(ApiService)
  private router: Router = inject(Router)
  private location: Location = inject(Location)

  public item: WritableSignal<ApiItem> = signal({} as ApiItem)
  public isLoading: WritableSignal<boolean> = signal(false)
  public error: WritableSignal<string> = signal('')

  ngOnInit() {
    this.toggleIsLoading()
    const id = this.router.url
    this.apiService
      .fetchData(id)
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
