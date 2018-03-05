import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'character-counter',
  templateUrl: './character-counter.component.html',
  styleUrls: ['./character-counter.component.scss']
})
export class CharacterCounterComponent implements OnInit {

  @Input() field: any;
  @Input() maxLength: number;

  constructor() { }

  ngOnInit() { }

  characterCountOfMax() {
    // console.log(this.field.value);
    const count = this.field.value.length;
    return `${this.maxLength - count}`;
  }

  characterLimitReached() {
    const fieldLength: number = this.field.value.length;
    return fieldLength >= this.maxLength;
  }
}
