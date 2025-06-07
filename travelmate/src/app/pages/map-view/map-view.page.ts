import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSearchbar, IonList, IonItem, IonLabel, IonRouterOutlet, IonButton, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';


const loader = new Loader({
  apiKey: 'AIzaSyC1h8HyptSYlslcFi6bYYzEqE1FI-7qe1g',
  version: 'weekly'
});

let apiLoaded = false;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.page.html',
  styleUrls: ['./map-view.page.scss'],
  standalone: true,
  imports: [IonButtons, CommonModule, FormsModule, IonSearchbar, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel]
})
export class MapViewPage implements OnInit {
  lat!: number;
  lng!: number;
  locationName: string = '';
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];

  searchTerm: string = '';
  allLocations: { name: string; lat?: number; lng?: number; address?: string }[] = [];
  filteredLocations: { name: string; lat?: number; lng?: number; address?: string }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.lat = parseFloat(params['lat']);
      this.lng = parseFloat(params['lng']);
      this.locationName = params['name'] || 'Pinned Location';

      const rawOthers = params['others'];
      if (rawOthers) {
        try {
          this.allLocations = JSON.parse(rawOthers);
        } catch (err) {
          console.error('Error parsing others:', err);
          this.allLocations = [];
        }
      }

      this.filteredLocations = [...this.allLocations];
      this.loadMap(this.lat, this.lng, this.locationName);
    });
  }

  loadMap(lat: number, lng: number, name: string) {
    if (apiLoaded) {
      this.initMap(lat, lng, name);
    } else {
      loader.load().then(() => {
        apiLoaded = true;
        this.initMap(lat, lng, name);
      });
    }
  }

  initMap(lat: number, lng: number, name: string) {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat, lng },
      zoom: 14
    });

    this.placeMarker(lat, lng, name);
  }

  placeMarker(lat: number, lng: number, name: string) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: name
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-size: 14px; font-weight: 500;">${name}</div>`
    });

    // Show info window on hover
    marker.addListener('mouseover', () => {
      infoWindow.open(this.map, marker);
    });

    // Close info window on mouseout
    marker.addListener('mouseout', () => {
      infoWindow.close();
    });

    this.markers.push(marker);
  }

  addMarker(location: { name: string; lat?: number; lng?: number; address?: string }) {
    if (location.lat && location.lng) {
      this.placeMarker(location.lat, location.lng, location.name);
    } else if (location.address) {
      const query = encodeURIComponent(location.address);
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyC1h8HyptSYlslcFi6bYYzEqE1FI-7qe1g`)
        .then(res => res.json())
        .then(data => {
          const loc = data.results[0]?.geometry?.location;
          if (loc) {
            this.placeMarker(loc.lat, loc.lng, location.name);
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    }
  }

  filterLocations() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLocations = this.allLocations.filter(loc =>
      loc.name.toLowerCase().includes(term)
    );
  }

  addAllMarkers() {
    this.allLocations.forEach(loc => this.addMarker(loc));
  }
}