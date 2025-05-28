import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon]
})
export class SearchLocationPage implements AfterViewInit {
  map!: google.maps.Map;
  autocomplete!: google.maps.places.Autocomplete;
  inputElement!: HTMLInputElement;
  searchQuery: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {
      addIcons({ add });
  }

 async ngAfterViewInit(): Promise<void> {
    // Wait for DOM and query params before initializing
    setTimeout(() => {
      this.inputElement = document.getElementById('search-input-location') as HTMLInputElement;
      this.initializeAutocomplete();
    }, 0);

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      if (this.searchQuery) {
        this.loadMap();
      }
    });
  }

  async initializeAutocomplete(): Promise<void> {
    if (!this.inputElement) return;

   this.autocomplete = new google.maps.places.Autocomplete(this.inputElement, {
      types: ['establishment'],
      fields: ['formatted_address', 'geometry', 'name', 'place_id']
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (place && place.geometry && place.place_id) {
        this.searchQuery = place.formatted_address || place.name || '';
        localStorage.setItem('selectedPlace', JSON.stringify({
          name: place.name,
          address: place.formatted_address,
          placeId: place.place_id
        }));
        this.loadMap(); // Show new result
      }
    });
  }


 async loadMap(): Promise<void> {
    const mapElement = document.getElementById('map') as HTMLElement;
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    this.map = new google.maps.Map(mapElement, {
      center: { lat: 0, lng: 0 },
      zoom: 14,
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.searchQuery }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        if (location) {
          this.map.setCenter(location);

          new google.maps.Marker({
            map: this.map,
            position: location,
            title: this.searchQuery,
          });
        }
      } else {
        alert('Location not found.');
        console.error('Geocode error:', status);
      }
    });
  }

  goToAddLocation(): void {
    this.router.navigate(['/add-location']);
  }

  onSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate([], {
        queryParams: { query: this.searchQuery.trim() },
        queryParamsHandling: 'merge',
      });
    }
  }
}
