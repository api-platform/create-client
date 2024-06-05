import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {SidebarComponent} from "./components/common/sidebar/sidebar.component";
import {HeaderComponent} from "./components/common/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, HttpClientModule, SidebarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Api Platform Angular Admin';
}
