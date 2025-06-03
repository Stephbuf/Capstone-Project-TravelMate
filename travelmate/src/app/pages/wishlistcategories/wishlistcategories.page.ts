import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon, IonHeader } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wishlistcategories',
  templateUrl: './wishlistcategories.page.html',
  styleUrls: ['./wishlistcategories.page.scss'],
  standalone: true,
  imports: [ 
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    CommonModule,
    FormsModule
  ]
})
export class WishlistCategoriesPage implements OnInit {
  city: string = '';
  categories: { name: string; places: any[] }[] = [];
  expandedCategory: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.city = params['city'];
      const userEmail = localStorage.getItem('email');

      this.http
        .get<any[]>(`http://localhost:3000/locations/user/${userEmail}?tag=wishlist`)
        .subscribe((data) => {
          const filtered = data.filter((entry) => entry.city === this.city);
          const categoryMap = new Map<string, any[]>();

          filtered.forEach((entry) => {
            const displayName = entry.location_name?.trim()
              ? entry.location_name
              : this.getLabelFromAddress(entry.address);

            const entryWithName = { ...entry, name: displayName };

            if (!categoryMap.has(entry.category)) {
              categoryMap.set(entry.category, []);
            }

            categoryMap.get(entry.category)!.push(entryWithName);
          });

          this.categories = Array.from(categoryMap.entries()).map(([name, places]) => ({
            name,
            places
          }));
        });
    });
  }

  toggleCategory(categoryName: string): void {
    this.expandedCategory =
      this.expandedCategory === categoryName ? null : categoryName;
  }

  getLabelFromAddress(address: string): string {
    if (!address) return '';
    return address.split(',')[0];
  }
}
