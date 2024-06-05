import {Component, signal, WritableSignal} from '@angular/core';
import {DeleteComponent} from "../../common/delete/delete.component";
import {RouterLink} from "@angular/router";
import {HeroService} from "../../../service/hero.service";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Foo} from "../../../interface/foo.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    DeleteComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  public isLoading: WritableSignal<boolean> = signal(false)
  public item: WritableSignal<Foo> = signal({})
  public input:FormControl<string | null> = new FormControl('')

  constructor(private heroService: HeroService, private location: Location) {
  }

  setItem(event: any) {
    this.item.set(event)
  }

  onSubmit(event: any) {
    return this.heroService
      .add('/heroes',
        {
          name: this.input.value
        }
      ).subscribe(
        (item) => {
          this.isLoading.set(true)
          this.location.back()
        }
      )
  }

}
