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

  hosts: string[] = ['192.168.4.1', '172.217.28.1'];
  public connected$ = new BehaviorSubject<string>('');
  public connState: boolean;

  location: Location;
  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.connected$.subscribe(connected => {
      if (connected) {

        // window.location.href = "https://anothergitdev.github.io/worvy-ui/devices?worvyip=" + connected;
        console.log("Connected: ", connected);
      }
    }, err => console.log(err));
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
      this.goToUnSecure();
      this.startPIng();
    }
    if (stepGrp.selectedIndex === stepGrp._steps.length - 1) {
      this.goToSecure();
    }
    if (stepGrp.selectedIndex < stepGrp._steps.length - 1) {
      this.matStepper.selectedIndex++;
    } else {
      this.matStepper.selectedIndex = 0;
    }
  }

  startPIng() {
    //http://192.168.4.1/wifisave?s=OnePlus+5&p=12345687
    console.log('ping started...')
    let pingData = { id: 1, action: 'ping' };
    this.hosts.forEach(host => {
      this.httpClient.post(`http://${host}/ping`, pingData, { responseType: 'text' })
        .pipe(first())
        .subscribe(

          resp => {
            console.log("ping response > ", resp)
            this.connected(host);
          },
          err => {
            console.log('HTTP Error', err);
          }
        );
    });

  }


  connected(data: string) {
    this.connected$.next(data);
  }

  goToSecure() {
    if (location.protocol === 'http:') {
      window.location.href = location.href.replace('http', 'https');
    }
  }

  goToUnSecure() {
    if (location.protocol === 'http:') {
      window.location.href = ""
    }
  }

}
