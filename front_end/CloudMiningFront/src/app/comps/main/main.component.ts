import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  href: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  tiles: Tile[] = [
    {
    text: 'Data Visualization', cols: 3, rows: 1, 
    color: 'lightblue url(https://thepracticalr.files.wordpress.com/2016/11/barplot3.png?w=800) center', 
    href: "/datavisualization"
    },
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen', href: ''},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink', href: ''},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1', href: ''},
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
