import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption]
})
export class AddLocationPage implements OnInit {
  locationForm!: FormGroup;
  categories = ['Restaurant', 'Bar', 'Shopping', 'Museum', 'Sight Seeing', 'Beach', 'Club', 'Add Category'];
  showCustomCategory = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedPlace');
    const parsed = stored ? JSON.parse(stored) : {};

    this.locationForm = this.fb.group({
      country: [parsed.country || '', Validators.required],
      city: [parsed.city || '', Validators.required],
      address: [parsed.address || '', Validators.required],
      category: ['', Validators.required],
      customCategory: ['']
    });
  }

  onCategoryChange(event: any): void {
    this.showCustomCategory = event.detail.value === 'Add Category';
    if (!this.showCustomCategory) {
      this.locationForm.patchValue({ customCategory: '' });
    }
  }

  onSubmit(): void {
    if (this.locationForm.invalid) return;

    this.isSubmitting = true;

    const { country, city, address, category, customCategory } = this.locationForm.value;
    const payload = {
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      category: this.showCustomCategory ? customCategory.trim() : category
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
