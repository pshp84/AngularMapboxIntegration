import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, Marker, NavigationControl } from 'maplibre-gl';
import { CommonService } from '../services/common.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  @ViewChild('map', { static: false }) mapContainer: ElementRef<HTMLElement>;
  datas: any;
  mapMarkers: any = [];
  isBackBtn: boolean = false;
  defaultLongitude: number = -97.419173;
  defaultLatitude: number = 32.674341;
  defaultZoom: number = 12;
  makerColor: string = "#FF0000"
  constructor(private _commonService: CommonService) { }

  ngOnInit() {
    this.datas = this._commonService.getMapDatas();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.isBackBtn = false;
    var initialState = { lng: this.defaultLongitude, lat: this.defaultLatitude, zoom: this.defaultZoom };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/eef16200-c4cc-4285-9370-c71ca24bb42d/style.json?key=${environment.mapKey}`,
      zoom: initialState.zoom
    });
    this.map.addControl(new NavigationControl(), 'top-right');
    if (this.datas) {
      if (this.datas.records) {
        initialState.lng = this.datas.records[this.datas.records.length - 1].geocode.Longitude;
        initialState.lat = this.datas.records[this.datas.records.length - 1].geocode.Latitude;
        this.datas.records.forEach(element => {
          var self = this;
          const marker = new Marker({ color: this.makerColor  })
            .setLngLat([element.geocode.Longitude, element.geocode.Latitude])
            .addTo(this.map);
          marker.getElement().addEventListener('click', function (e) {
            self.setLatLngListing(element.geocode.Longitude, element.geocode.Latitude);
          });
          this.mapMarkers.push(marker);
        });
      }
    }
    this.map.setCenter([initialState.lng, initialState.lat]);
  }

  setLatLngListing(Longitude: any, Latitude: any) {
    this.isBackBtn = true;
    this.mapMarkers.forEach((marker) => marker.remove())
    this.mapMarkers = []
    if (this.map != undefined && this.map != null) {
      this.map.setCenter([Longitude, Latitude]);
      this.map.setZoom(16);
      const marker = new Marker({ color: this.makerColor, draggable: true })
        .setLngLat([Longitude, Latitude])
        .addTo(this.map);
      this.mapMarkers.push(marker);
    }
  }

  ngOnDestroy() {
    this.map.remove();
  }

}
