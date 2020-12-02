import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.css']
})

export class DataVisualizationComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
