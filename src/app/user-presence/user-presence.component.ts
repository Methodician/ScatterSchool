import { Component, OnInit, Input } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'user-presence',
  templateUrl: './user-presence.component.html',
  styleUrls: ['./user-presence.component.css']
})
export class UserPresenceComponent implements OnInit {
  @Input() userKey;
  userPresence;

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.getUserPresence(this.userKey).subscribe(userPresence => {
      this.userPresence = userPresence;
    });
  }

  userState() {
    if(this.userPresence.connections) return 'online';
    if(this.userPresence.lastOnline) return 'offline';
  }
}
