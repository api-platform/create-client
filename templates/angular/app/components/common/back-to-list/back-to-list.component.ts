import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-back-to-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './back-to-list.component.html'
})
export class BackToListComponent {
  @Input() url!: string;
}
