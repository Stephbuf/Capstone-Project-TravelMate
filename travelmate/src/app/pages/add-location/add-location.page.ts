import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
  standalone: true,
  imports: [
    IonCardContent, IonCardTitle, IonCardHeader, IonCard,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonLabel,
    IonItem,
    IonInput,
    IonContent,
    IonSelect,
    IonSelectOption,

]
})
export class AddLocationPage implements OnInit {
  locationForm!: FormGroup;
  categories = ['Restaurant', 'Bar', 'Shopping', 'Museum', 'Sightseeing', 'Beach', 'Club', 'Airport', 'Hotel', 'Gallery', 'Coffee Shop', 'Bakery', 'Landmark'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedPlace');
    const parsed = stored ? JSON.parse(stored) : {};

    const address = parsed.address || '';
    const city = parsed.city || '';
    const country = parsed.country || '';

    this.locationForm = this.fb.group({
      country: [country, Validators.required],
      city: [city, Validators.required],
      address: [address, Validators.required],
      category: ['', Validators.required],
      tag: ['wishlist', Validators.required],
       location_name: ['', Validators.required] 
    });
  }

onSubmit(): void {
  if (this.locationForm.invalid) return;

  this.isSubmitting = true;

  const { country, city, address, category, tag, location_name } = this.locationForm.value;

  const payload = {
    country: country.trim(),
    city: city.trim(),
    address: address.trim(),
    category: category.trim(),
    tag,
    wishlist: tag === 'wishlist',
    location_name: location_name.trim(),
    userEmail: localStorage.getItem('email'),
  };

console.log('🚀 Payload being sent:', payload);

  this.http.post('http://localhost:3000/locations', payload).subscribe({
    next: () => {
      alert('Location added!');
      this.router.navigate(['/tabs/tab2']);
      this.isSubmitting = false;
    },
    error: (err) => {
      console.error('Error saving location:', err);
      alert('Failed to save location.');
      this.isSubmitting = false;
    }
  });
}


}