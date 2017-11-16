import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SuggestionService } from "app/shared/services/suggestion/suggestion.service";

@Component({
  selector: 'app-suggestion-detail',
  templateUrl: './suggestion-detail.component.html',
  styleUrls: ['./suggestion-detail.component.scss']
})
export class SuggestionDetailComponent implements OnInit {
  suggestion;
  constructor(private route: ActivatedRoute, private service: SuggestionService) { }

  ngOnInit() {
    let key = this.route.snapshot.params['key'];
    this.service.getSuggestionByKey(key)
      .subscribe(object => {
        this.suggestion = object;
      });
  }
}
