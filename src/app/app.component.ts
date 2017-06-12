import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  data: any;
  constructor(private db: AngularFireDatabase) {
    console.log(db);
  }

  ngOnInit() {
    this.db.object('/').subscribe(data => {
      this.data = data;
    })
  }
}
