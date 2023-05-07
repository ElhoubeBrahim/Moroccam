import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuidePage } from './guide.page';

import { GuidePageRoutingModule } from './guide-routing.module';
import { GoogleMapsModule } from "@angular/google-maps";

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		GuidePageRoutingModule,
		GoogleMapsModule
	],
	declarations: [GuidePage],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
	
})
export class GuidePageModule {

}
