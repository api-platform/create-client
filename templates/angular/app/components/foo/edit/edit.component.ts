import {CommonModule, Location} from "@angular/common";
import {Component, OnInit, signal,WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {DeleteComponent} from "@components/common/delete/delete.component";
import {FormComponent} from "@components/{{lc}}/form/form.component";
import {ApiItem} from "@interface/api";
import {ApiService} from "@service/api.service";


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
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
  public error: WritableSignal<string> = signal('')
  public formType: Array<{ name: string; type: string }> = [
    {
      name: 'name',
      type: 'string',
    }
  ]

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit() {
    const uri = this.router.url.split('/edit')[0]
    this.isLoading.set(true)
    this.apiService.fetchData(uri)
      .subscribe(value => {
        this.item.set(value)
        this.isLoading.set(false)
      })
  }

  onSubmit(data: any) {
    return this.apiService
      .put(
        this.item()['@id']!,
        {
          ...this.item,
          ...data
        })
      .subscribe(
        () => this.location.back()
      )
  }

  delete() {
    return this.apiService
      .delete(this.item()['@id']!)
      .subscribe(
        () => this.location.back()
      )
  }
}
