import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user/user.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userList;

  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.getUserList().subscribe(userList => {
      this.userList = userList;
    });
  }

  displayName(user) {
    return user.alias ? user.alias : user.fName;
  }
}
