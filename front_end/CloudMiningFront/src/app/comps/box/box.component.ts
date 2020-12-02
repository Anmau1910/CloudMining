import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  load= false;
  response: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.load = true;
    const params = new HttpParams();

    this.http.get(`${environment.apiUrl}/box`, { params }).pipe(
      retry(3),
      catchError(err => {
        console.error(`Error ${err.status} getting boxplot`);
        return of(null);
      }))
      .subscribe(res => {
        this.response = res;
        console.log(this.response);
        window.scroll(0,10000);
      });
  }
  scroll() {
    this.load = false;
    window.scroll(0,1000);
  }

}
