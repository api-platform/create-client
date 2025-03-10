import {Component, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Pagination} from "@interface/api";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pagination!: WritableSignal<Pagination>;
  @Output() handleChangePage = new EventEmitter()

  changeUri(uri: string) {
    this.handleChangePage.emit(uri)
  }
}
