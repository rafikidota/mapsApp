import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styles: [
    `
     .map-container{
      width:100%;
      height:100%;
    }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index:99;
    }
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarkerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 12;
  center: [number, number] = [-82.35970147301727, 23.135464380526386];
  markers: MarkerColor[] = [];
  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    // Crear marcador que diga Hola Mundo
    // const marker: HTMLElement = document.createElement('div');
    // marker.innerHTML = 'Hola Mundo';
    // new mapboxgl.Marker({
    //   element: marker
    // }).setLngLat(this.center).addTo(this.map);

    this.loadLocalStorage();

    this.map.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }

  ngOnDestroy(): void {
    this.map.off('move', () => { });
  }

  createMarker(): MarkerColor {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: color
    }).setLngLat(this.center).addTo(this.map);
    newMarker.on('dragend', () => {
      this.saveLocalStorage();
    });
    return {
      color: color,
      marker: newMarker
    };
  }

  addMarker() {
    const mc = this.createMarker();
    console.log(mc.marker);     
    this.markers.push({
      color: mc.color,
      marker: mc.marker
    });
    this.saveLocalStorage();
  }

  updateMarker() {

  }

  deleteMarker(index: number) {
    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
    this.saveLocalStorage();
  }

  goToMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat()
    });
  }

  saveLocalStorage() {
    const data: MarkerColor[] = [];
    this.markers.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      data.push({
        color: color,
        center: [lng, lat]
      });
    });
    localStorage.setItem('markers', JSON.stringify(data));
  }

  loadLocalStorage() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const data: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!);
    data.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      }).setLngLat(m.center!).addTo(this.map);
      this.markers.push({
        color: m.color,
        marker: newMarker
      });
      newMarker.on('dragend', () => {
        this.saveLocalStorage();
      });
    });
  }

}
