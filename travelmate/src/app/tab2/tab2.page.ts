import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})
export class Tab2Page implements OnInit {
  allData: any[] = [];
  wishlistData: any[] = [];
  expandedCountry: string | null = null;
  currentFilter: 'wishlist' | 'itinerary' = 'wishlist';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const userEmail = localStorage.getItem('email');

    this.http
      .get<any[]>(`http://localhost:3000/locations/user/${userEmail}?tag=${this.currentFilter}`)
      .subscribe((data) => {
        this.allData = data;
        this.applyFilter();
      });
  }

  applyFilter(): void {
    const grouped = new Map<string, any[]>();
    this.allData.forEach((item) => {
      if (!grouped.has(item.country)) {
        grouped.set(item.country, []);
      }
      grouped.get(item.country)!.push(item);
    });

    this.wishlistData = Array.from(grouped.entries()).map(([country, entries]) => ({
      country,
      entries
    }));
  }

  setFilter(filter: 'wishlist' | 'itinerary'): void {
    if (filter !== this.currentFilter) {
      this.currentFilter = filter;
      this.expandedCountry = null;
      this.fetchData();
    }
  }

  toggleCountry(country: string): void {
    this.expandedCountry = this.expandedCountry === country ? null : country;
  }

  getUniqueCities(entries: any[]): string[] {
    const citySet = new Set<string>();
    entries.forEach(entry => citySet.add(entry.city));
    return Array.from(citySet);
  }

goToCityPage(city: string): void {
  const match = this.allData.find(entry => entry.city === city);

  if (!match || !match.address) {
    console.warn('No valid entry found for city:', city, match);
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: match.address }, (results, status) => {
    if (status === 'OK' && results && results[0]) {
      const location = results[0].geometry.location;

      this.router.navigate(['/itinerary'], {
        queryParams: {
          name: match.name,
          city: match.city,
          address: match.address,
          category: match.category,
          lat: location.lat(),
          lng: location.lng(),
        },
      });
    } else {
      console.error('Geocoding failed:', status);
    }
  });
}

}