//import { DataCleanupService } from 'app/shared/services/data-cleanup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-cleanup',
  templateUrl: './data-cleanup.component.html',
  styleUrls: ['./data-cleanup.component.scss']
})
export class DataCleanupComponent implements OnInit {

  //constructor(private dataCleanupSvc: DataCleanupService) { }

  ngOnInit() {
  }

  articleNodeIdToKey() {
    //this.dataCleanupSvc.articleNodeIdToKey();
  }

}
