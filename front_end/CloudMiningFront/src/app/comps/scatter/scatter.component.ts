import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})


export class ScatterComponent implements OnInit {
  option = new FormControl();  
  opts = ['mpg','cyl','disp','hp','drat','wt','qsec','vs','am','gear','carb' ];
  response: any;
  load = false;
  
  // yopts = ['Mazda RX4', 'Mazda RX4 Wag', 'Datsun 710', 'Hornet 4 Drive','Hornet Sportabout', 'Valiant',
  // 'Duster 360','Merc 240D', 'Merc 230', 'Merc 280', 'Merc 280C', 'Merc 450SE', 'Merc 450SL', 'Merc 450SLC', 'Cadillac Fleetwood',
  // 'Lincoln Continental', 'Chrysler Imperial', 'Fiat 128', 'Honda Civic', 'Toyota Corolla', 'Toyota Corona', 'Dodge Challenger',
  // 'AMC Javelin', 'Camaro Z28', 'Pontiac Firebird', 'Fiat X1-9', 'Porsche 914-2', 'Lotus Europa', 'Ford Pantera L', 'Ferrari Dino',
  // 'Maserati Bora','Volvo 142E'];
  
  
  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    window.scroll(0,1000);  
  } 

  scatter() {
    this.load=true;
    const params = new HttpParams().set('x', this.option.value[0]).set('y', this.option.value[1]);

    this.http.get(`${environment.apiUrl}/scatter`, { params }).pipe(
      retry(3),
      catchError(err => {
        console.error(`Error ${err.status} getting scatterplot`);
        return of(null);
      }))
      .subscribe(res => {
        this.response = res;
        console.log(this.response);
        window.scroll(0,10000);
      });
  }

  scroll() {
    this.load =false;
    window.scroll(0,1000);
  }

}
