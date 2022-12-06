import { Component } from '@angular/core';
import { describeEngine } from './engine';


const { provideEngine, injectEngine } = describeEngine({
  count: 0
})

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Value: {{ vm.count }}</p>
      <button (click)="vm.count = vm.count + 1">Click me</button>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  providers: [provideEngine()]
})
export class AppComponent {
  readonly vm = injectEngine().vm;
}
