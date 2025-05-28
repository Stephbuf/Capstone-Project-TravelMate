import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  IonInput
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonLabel,
    IonItem,
    IonInput,
    IonContent,
    IonSelect,
    IonSelectOption
  ]
})
export class AddLocationPage implements OnInit {
  locationForm!: FormGroup;
  categories = ['Restaurant', 'Bar', 'Shopping', 'Museum', 'Sight Seeing', 'Beach', 'Club', 'Add Category'];
  showCustomCategory = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedPlace');
    const parsed = stored ? JSON.parse(stored) : {};

    const address = parsed.address || '';
    const components = parsed.components || [];
    const city = this.extractComponent(components, 'locality') || '';
    const country = this.extractComponent(components, 'country') || '';

 this.locationForm = this.fb.group({
  country: [parsed.country || country, Validators.required],
  city: [parsed.city || city, Validators.required],
  address: [parsed.address || address, Validators.required],
  category: ['', Validators.required],
  custom_category: ['']
});

  }

  extractComponent(components: any[], type: string): string | null {
    const match = components.find(c => c.types.includes(type));
    return match ? match.long_name : null;
  }

  onCategoryChange(event: any): void {
    this.showCustomCategory = event.detail.value === 'Add Category';
    if (!this.showCustomCategory) {
      this.locationForm.patchValue({ customCategory: '' });
    }
    this.cdr.detectChanges();
  }

 onSubmit(): void {
  if (this.locationForm.invalid) return;

  this.isSubmitting = true;

  const { country, city, address, category, custom_category } = this.locationForm.value;

  const trimmedCountry = country?.trim() || '';
  const trimmedCity = city?.trim() || '';
  const trimmedAddress = address?.trim() || '';
  const trimmedCategory = category?.trim() || '';
  const trimmedCustom = custom_category?.trim() || null;

  const payload = {
    country: trimmedCountry,
    city: trimmedCity,
    address: trimmedAddress,
    category: this.showCustomCategory ? trimmedCustom : trimmedCategory,
    custom_category: this.showCustomCategory ? trimmedCustom : null
  };

  this.http.post('http://localhost:3000/locations', payload).subscribe({
    next: () => {
      alert('Location added!');
      this.router.navigate(['/tabs/tab1']);
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