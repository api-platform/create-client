import { Component } from '@angular/core';
import {MenuComponent} from "@components/common/svg/menu/menu.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
