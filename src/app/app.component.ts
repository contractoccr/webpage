import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-first-angular-app';
  constructor(private translocoService: TranslocoService) {}

  switchLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

}
