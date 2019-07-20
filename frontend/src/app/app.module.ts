import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms"; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CarService } from './modules/car.service';
import { CommonService } from './modules/config'

import { IndexComponent } from './index/index.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewAdComponent }       from './new-ad/new-ad.component';
import { ManageAdComponent } from './manage-ad/manage-ad.component';
import { CarSearchComponent } from './car-search/car-search.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { MonitorPageComponent } from './monitor-page/monitor-page.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    UserProfileComponent,
    NewAdComponent,
    ManageAdComponent,
    CarSearchComponent,
    CarDetailComponent,
    MonitorPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    CarService,
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
