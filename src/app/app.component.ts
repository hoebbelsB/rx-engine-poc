import { Component, HostBinding } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { describeEngine } from './engine';
import { RxStyle } from './style.directive';


const { provideEngine, injectEngine } = describeEngine({
  count: 0
})

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Value: {{ vm.count }}</p>
      <button (click)="vm.count = vm.count + 1;">Click me</button>
    </div>
  `,
  styles: [`:host { display: block }`],
  providers: [provideEngine()],
  // hostDirectives: [RxStyle]
})
export class AppComponent {

  // @HostBinding('style.backgroundColor')
  get bgColor() {
    return this.vm.count % 2 === 0 ? 'red' : 'blue';
  }

  readonly vm = injectEngine().vm;

  // readonly style$ = new BehaviorSubject<string>('red');

  /*constructor(private style: RxStyle) {
    style.style = {
      'background-color': this.style$
    };
  }*/
}
