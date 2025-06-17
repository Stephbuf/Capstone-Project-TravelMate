import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular'; // make sure these are imported




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

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController, private alertController: AlertController) {}

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
        const route = this.currentFilter === 'wishlist' ? '/wishlistcategories' : '/itinerarycategories';

        this.router.navigate([route], {
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

  async editLocation(name: string, type: 'city' | 'country') {
  const alert = await this.alertController.create({
    header: `Edit ${type === 'city' ? 'City' : 'Country'} Name`,
    inputs: [
      {
        name: 'name',
        type: 'text',
        placeholder: `${type} Name`,
        value: name
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Save',
        handler: (data) => {
          if (data.name && data.name.trim() !== '') {
            const newName = data.name.trim();
            const userEmail = localStorage.getItem('email');  // Fetch email from localStorage

            if (userEmail) {
              // Send PUT request to backend with the new name, userEmail, and the type (city/country)
              this.http.put(`http://localhost:3000/locations/editLocation/${type}/${encodeURIComponent(name)}`, { newName, userEmail })
                .subscribe({
                  next: () => {
                    this.presentToast(`${type === 'city' ? 'City' : 'Country'} name updated.`);
                    this.fetchData();  // Re-fetch data after update to reflect changes
                  },
                  error: (err) => {
                    console.error(`Error updating ${type}:`, err);
                    this.presentToast(`Error updating ${type}`);
                  }
                });
            } else {
              console.error('User email not found');
              this.presentToast('Error: User email not found');
            }
          }
        }
      }
    ]
  });

  await alert.present();
}


  async deleteCity(city: string) {
    const userEmail = localStorage.getItem('email');
    this.http.delete(`http://localhost:3000/locations/city/${city}`)
      .subscribe({
        next: () => {
          this.presentToast('City deleted.');
          this.fetchData();  // Re-fetch data after deletion
        },
        error: (err) => {
          console.error('Error deleting city:', err);
          this.presentToast('Error deleting city');
        }
      });
  }

  async deleteCountry(country: string) {
    const userEmail = localStorage.getItem('email');
    this.http.delete(`http://localhost:3000/locations/country/${country}`)
      .subscribe({
        next: () => {
          this.presentToast(`Deleted all entries for ${country}`);
          this.fetchData();  // Re-fetch data after deletion
        },
        error: (err) => {
          console.error('Error deleting country:', err);
          this.presentToast(`Error deleting ${country}`);
        }
      });
  }

  // Move a country from Wishlist to Itinerary or vice versa
moveCountry(country: string) {
  const email = localStorage.getItem('email');

  // 🔍 Debug log to verify payload before sending the request
  console.log('⏩ Moving country with:', {
    email,
    country,
    currentTag: this.currentFilter
  });

  this.http.put('http://localhost:3000/locations/move-country', {
    email,
    country,
    currentTag: this.currentFilter
  }).subscribe({
    next: (response) => {
      const newTag = this.currentFilter === 'wishlist' ? 'itinerary' : 'wishlist';
      this.presentToast(`${country} moved to ${newTag}`);
      this.fetchData();
    },
    error: (err) => {
      console.error('Error moving country:', err);
      this.presentToast('Error moving country');
    }
  });
}


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
  goToProfile() {
  // Replace this with your actual navigation logic
  console.log('Navigating to Profile...');
  // this.router.navigate(['/profile']); // example route
}

goToSettings() {
  console.log('Navigating to Settings...');
  // this.router.navigate(['/settings']);
}

goToGeneral() {
  console.log('Navigating to General...');
  // this.router.navigate(['/general']);
}

  logout() {
  localStorage.removeItem('email');  // Clear user session
  this.router.navigate(['/login']);  // Redirect to login page
}
goToAddLocation() {
  this.router.navigate(['/tabs/tab1']);
}



}

