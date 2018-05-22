import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data = [
    {id: 1, name: "Sean Johnston", score: 99, description: "d1"},
    {id: 2, name: "Morgan Davies", score: 80, description: "d2"},
    {id: 3, name: "Morgan John", score: 80, description: "d3"},
    {id: 4, name: "Tommy Walker", score: 80, description: "d4"},
    {id: 5, name: "William Lee", score: 80, description: "d5"},
    {id: 6, name: "Russell Brady", score: 80, description: "d6"},
    {id: 7, name: "Isaiah Ferguson", score: 80, description: "d7"},
    {id: 8, name: "Dominic Lynch", score: 80, description: "d8"},
    {id: 9, name: "Alberto Walls", score: 80, description: "d9"},
    {id: 10, name: "Jerry Pate", score: 80, description: "d10"},
    {id: 11, name: "Spencer Gordon", score: 79, description: "d11"},
  ]

  formatter = (value: any) => {
    return value + ' postfix'
  }
}
