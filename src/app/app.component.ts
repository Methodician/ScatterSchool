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
  chatExpanded: boolean = false;
  constructor(private db: AngularFireDatabase) {
    // console.log(db);
  }

  ngOnInit() {
    this.db.object('/').subscribe(data => {
      this.data = data;
    })
  }

  toggleChat() {
    this.chatExpanded = !this.chatExpanded;
  }
}
