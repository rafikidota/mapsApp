import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MiniMapComponent } from './components/mini-map/mini-map.component';
import { FullScreenComponent } from './pages/full-screen/full-screen.component';
import { MarkerComponent } from './pages/marker/marker.component';
import { ZoomRangeComponent } from './pages/zoom-range/zoom-range.component';
import { PropertyComponent } from './pages/property/property.component';


@NgModule({
  declarations: [
    MiniMapComponent,
    FullScreenComponent,
    MarkerComponent,
    ZoomRangeComponent,
    PropertyComponent
  ],
  imports: [
    CommonModule,
    MapsRoutingModule
  ]
})
export class MapsModule { }
