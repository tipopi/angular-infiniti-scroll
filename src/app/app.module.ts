import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { FatherComponent } from "./father/father.component";
import { ScrollComponent } from "./scroll/scroll.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DemoMaterialModule } from "./material/material.module";
import { MatNativeDateModule } from "@angular/material/core";
import { CommonModule } from '@angular/common';
import { SonComponent } from './son/son.component';
import { InfiniteScrollListService } from './scroll/infinite-scroll-list.service';
import { ScrollService } from './scroll/scroll.service';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatSliderModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    FatherComponent,
    ScrollComponent,
    SonComponent
  ],
  bootstrap: [AppComponent],
  providers: [InfiniteScrollListService, ScrollService]
})
export class AppModule {}
