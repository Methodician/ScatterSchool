import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit {
  // placeholder data until getAllSuggestions service method is implemented
  suggestions = [{
    title: "I would like to build a fast car.",
    pitch: "Donec mattis efficitur scelerisque. Phasellus sit amet enim cursus, pretium lectus vel, posuere tortor."
  },{
    title: "Design a more efficient solar panel",
    pitch: "Donec mattis efficitur scelerisque. Phasellus sit amet enim cursus, pretium lectus vel, posuere tortor."
  }]
  
  constructor() { }

  ngOnInit() {
  }

}
