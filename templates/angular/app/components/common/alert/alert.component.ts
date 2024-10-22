import {Component, Input, WritableSignal} from '@angular/core';
import {SubmissionErrors} from "@interface/api";

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  @Input() type!: 'loading' | 'error';
  @Input() error!: WritableSignal<SubmissionErrors | null>;
}
