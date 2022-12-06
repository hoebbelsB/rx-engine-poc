import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RxStyle } from './style.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RxStyle
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
