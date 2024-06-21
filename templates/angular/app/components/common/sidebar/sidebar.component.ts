import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ListSvgComponent} from "@components/common/svg/list-svg/list-svg.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    ListSvgComponent,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
}
