import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
   
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar
  ]
})
export class Tab2Page implements OnInit {
  countries: any[] = [];
  selectedCountry: string | null = null;
  cities: any[] = [];
  filteredCities: any[] = [];
  currentFilter: 'wishlist' | 'itinerary' = 'wishlist';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/locations/countries').subscribe(data => {
      this.countries = data;
    });
  }

  selectCountry(country: string): void {
    this.selectedCountry = country;
    this.http.get<any[]>(`http://localhost:3000/locations/by-country/${country}`).subscribe(data => {
      this.cities = data;
      this.applyFilter();
    });
  }

  setFilter(filter: 'wishlist' | 'itinerary'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredCities = this.cities.filter(
      city => city.tag === this.currentFilter
    );
  }
}
