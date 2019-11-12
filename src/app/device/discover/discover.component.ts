import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  @ViewChild('matgroup', { static: true }) matgroup: MatTabGroup;

  constructor() { }

  ngOnInit() {
  }

  nextTab(tabGroup: MatTabGroup) {
    if (tabGroup.selectedIndex < tabGroup._tabs.length - 1) {
      this.matgroup.selectedIndex++;
    } else {
      this.matgroup.selectedIndex = 0;
    }
  }

}
