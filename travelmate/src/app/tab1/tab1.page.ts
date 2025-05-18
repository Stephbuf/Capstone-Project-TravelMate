import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {
  searchQuery: string = '';
  inputElement!: HTMLInputElement;
  autocomplete!: google.maps.places.Autocomplete;

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.inputElement = document.getElementById('search-input') as HTMLInputElement;
      if (this.inputElement) {
        this.autocomplete = new google.maps.places.Autocomplete(this.inputElement, {
          types: ['establishment'],
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        });

        this.autocomplete.addListener('place_changed', () => {
          const place = this.autocomplete.getPlace();
          if (place && place.place_id) {
            this.searchQuery = place.formatted_address || place.name || '';
            localStorage.setItem('selectedPlace', JSON.stringify({
              name: place.name,
              address: place.formatted_address,
              placeId: place.place_id
            }));
          }
        });
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.searchQuery.trim()) {
      this.router.navigate(['/search-location'], {
        queryParams: { query: this.searchQuery.trim() }
      });
    }
  }
}
