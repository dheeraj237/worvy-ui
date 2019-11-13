import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent, MatStep, MatStepLabel, MatStepper } from '@angular/material';

import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  @ViewChild('matgroup', { static: true }) matgroup: MatTabGroup;
  @ViewChild('stepper', { static: true }) matStepper: MatStepper;

  hosts: string[] = ['jsonplaceholder.typicode.com/todos/1', '192.168.43.91', '192.168.43.95', '192.168.43.97'];
  public connected$ = new BehaviorSubject<string>('');
  public connState: boolean;

  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.connected$.subscribe(connected => {
      if (connected) {
        console.log("Connected: ", connected);
      }
    });
  }

  nextTab(tabGroup: MatTabGroup) {
    if (tabGroup.selectedIndex < tabGroup._tabs.length - 1) {
      this.matgroup.selectedIndex++;
    } else {
      this.matgroup.selectedIndex = 0;
    }
  }

  nextStep(stepGrp: MatStepper) {
    if (stepGrp.selectedIndex === 1) {
      this.startPIng();
    }
    if (stepGrp.selectedIndex < stepGrp._steps.length - 1) {
      this.matStepper.selectedIndex++;
    } else {
      this.matStepper.selectedIndex = 0;
    }
  }

  startPIng() {
    let pingData = { id: 1, action: 'ping' };
    this.hosts.forEach(host => {
      this.httpClient.get('http://' + host, {
        observe: 'response'
      })
        .pipe(first())
        .subscribe(resp => {
          console.log(resp)
          if (resp.status === 200) {
            this.connected(host);
          } else {
            this.connected('');
          }
        }, err => this.connected(''));

    });

  }


  connected(data: string) {
    this.connected$.next(data);
  }

}
