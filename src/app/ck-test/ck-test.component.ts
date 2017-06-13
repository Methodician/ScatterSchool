import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ck-test',
  templateUrl: './ck-test.component.html',
  styleUrls: ['./ck-test.component.css']
})
export class CkTestComponent implements OnInit {
  ckeditorContent;

  constructor() {
    this.ckeditorContent = `<p>My HTML</p>`;
  }

  ngOnInit() {
  }

}
