import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  data: any;
  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
  }
}
