import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonBackButton, IonFooter, 
  IonToolbar} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wishlistcategories',
  templateUrl: './wishlistcategories.page.html',
  styleUrls: ['./wishlistcategories.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonIcon,
    IonLabel,
    IonItem,
    CommonModule,
    FormsModule,
    IonContent]
})
export class WishlistCategoriesPage implements OnInit {
  city: string = '';
  categories: { name: string; places: any[] }[] = [];
  expandedCategory: string | null = null;
  allPlaces: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.city = params['city'];
      const userEmail = localStorage.getItem('email');

      if (!userEmail || !this.city) return;

      this.http
        .get<any[]>(`http://localhost:3000/locations/user/${userEmail}?tag=wishlist`)
        .subscribe((data) => {
          const filtered = data.filter((entry) => entry.city === this.city);
          const categoryMap = new Map<string, any[]>();
          const allEntries: any[] = [];

          filtered.forEach((entry) => {
            const displayName = entry.location_name?.trim()
              ? entry.location_name
              : this.getLabelFromAddress(entry.address);

            const entryWithName = { ...entry, name: displayName };
            allEntries.push(entryWithName);

            if (!categoryMap.has(entry.category)) {
              categoryMap.set(entry.category, []);
            }

            categoryMap.get(entry.category)!.push(entryWithName);
          });

          this.categories = Array.from(categoryMap.entries()).map(([name, places]) => ({
            name,
            places
          }));

          this.allPlaces = allEntries;
        });
    });
  }

  getCategoryEmoji(name: string): string {
    const emojiMap: { [key: string]: string } = {
      'Restaurant': '🍽️',
      'Bar': '🍻',
      'Shopping': '🛍️',
      'Museum': '🏛️',
      'Sightseeing': '📸',
      'Beach': '🏖️',
      'Club': '💃',
      'Airport': '✈️',
      'Hotel': '🏨',
      'Gallery': '🖼️',
      'Coffee Shop': '☕',
      'Bakery': '🥐',
      'Landmark': '📍',
      'Downtown': '🏙️',
      'Hiking Trail': '🏔️',
      'Theatre': '🎭',
      'National Park': '🏞️'

    };
    return emojiMap[name] || '📍';
  }

  toggleCategory(categoryName: string): void {
    this.expandedCategory = this.expandedCategory === categoryName ? null : categoryName;
  }

  getLabelFromAddress(address: string): string {
    return address ? address.split(',')[0] : '';
  }

  goToMap(place: any) {
    const name = place.name;
    const address = place.address;

    const allOtherPlaces = this.categories.reduce((acc: any[], cat: { name: string; places: any[] }) => {
      const filtered = cat.places.filter(p => p.name !== name);
      return acc.concat(filtered);
    }, []);

    const others = JSON.stringify(allOtherPlaces);

    if (place.lat && place.lng && !isNaN(place.lat) && !isNaN(place.lng)) {
      this.router.navigate(['/map-view'], {
        queryParams: { lat: place.lat, lng: place.lng, name, others }
      });
    } else if (address) {
      const query = encodeURIComponent(address);
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyC1h8HyptSYlslcFi6bYYzEqE1FI-7qe1g`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            this.router.navigate(['/map-view'], {
              queryParams: {
                lat: location.lat,
                lng: location.lng,
                name,
                others
              }
            });
          } else {
            console.error('Geocoding failed:', data.status, data.error_message || '');
          }
        })
        .catch(err => {
          console.error('Geocoding request error:', err);
        });
    } else {
      console.error('No address or coordinates available for this place.');
    }
  }
}
