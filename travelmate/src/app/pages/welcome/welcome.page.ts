import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader,  CommonModule, FormsModule,]
})
export class WelcomePage implements OnInit {
  texts = ['W', 'e', 'l', 'c', 'o', 'm', 'e', ''];
  particleArray = Array.from({ length: 12 }, (_, i) => i);

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 5000);
  }
  
}
