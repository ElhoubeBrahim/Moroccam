import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TermsPage } from './terms.page';
import { TermsPageRoutingModule } from './terms-routing.module';
import { GoogleMapsModule } from "@angular/google-maps";
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		TermsPageRoutingModule,
		PinchZoomModule,
		GoogleMapsModule
	],
  declarations: [TermsPage]
})
export class TermsPageModule {}
