import { Component } from '@angular/core';
import {ListComponent} from "../../foo/list/list.component";
import {ListSvgComponent} from "../../svg/list-svg/list-svg.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

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
