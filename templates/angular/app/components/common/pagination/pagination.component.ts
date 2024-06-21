import {Component, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { Pagination} from "@interface/api";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() pagination!:WritableSignal<Pagination>;
  @Output() handleChangePage = new EventEmitter()

  pageParamValue(page: keyof Pagination) {
    const pageParams = this.pagination()[page].split('?page=')
    return {
      page: pageParams[1]
    }
  }

  changeUri (uri: string) {
    this.handleChangePage.emit(uri)
  }
}
