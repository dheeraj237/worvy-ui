import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @ViewChild('sidenav', { read: MatSidenav, static: true }) public sidenav;
  constructor(private sidenavService: SidenavService) { }

  ngOnInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(() => {
      console.log('Sidenav', this.sidenav);
      this.sidenav.open();
    });
  }

}
