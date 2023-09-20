import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-trade-done',
  templateUrl: './trade-done.component.html',
  styleUrls: ['./trade-done.component.scss']
})
export class TradeDoneComponent implements OnInit {
  count = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.count--;
      setTimeout(() => {
        this.count--;
        setTimeout(() => {
          this.count--;
          setTimeout(() => {
            this.count--;
            setTimeout(() => {
              this.count--;
              this.router.navigate(['/']);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }
}
