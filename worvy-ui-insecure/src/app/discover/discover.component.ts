import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent, MatStep, MatStepLabel, MatStepper } from '@angular/material';

import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


import * as uuid from 'uuid';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  @ViewChild('matgroup', { static: true }) matgroup: MatTabGroup;
  @ViewChild('stepper', { static: true }) matStepper: MatStepper;

  hosts: string[] = ['192.168.4.1'];
  public connected$ = new BehaviorSubject<string>('');
  public connState: boolean;
  location: Location;
  refData: any = {};
  deviceName: string;
  previousId: string;
  devIp;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.refData = JSON.parse(atob(params['referer']));
    });
    console.log('this.refData ', this.refData);
    this.connected$.subscribe(connected => {
      if (connected) {
        this.devIp = connected;
        localStorage.setItem('connected', connected);
        console.log("Connected: ", connected);
        this.matStepper.selectedIndex = 3;
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
    console.log('stepGrp ', stepGrp);
    if (stepGrp.selectedIndex === 1) {
      this.startPIng();
    }
    if (stepGrp.selectedIndex === 3) {
      this.getExistingConfig();
      // this.setConfig();
    }
    if (stepGrp.selectedIndex === 3) {
      this.getwifiList();
      // this.setConfig();
    }
    if (stepGrp.selectedIndex < stepGrp._steps.length - 1) {
      this.matStepper.selectedIndex++;
    } else {
      this.goToSecure();
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
            window.alert(`Can't find any network! Please connect to wifi to discover device.`);
            console.log('POST ping error', err);
            this.startPIng();
          }
        );
    });

  }

  setConfig() {
    let deviceid = uuid.v4();
    let data = {
      "deviceid": deviceid,
      "accountid": this.refData.accountid ? this.refData.accountid : "",
      "userid": this.refData.userid ? this.refData.userid : "xxxx-xxxx-xxxx-xxxx",
      "region": "ap-south-1",
      "iot_endpoint": "a26b9ws68ewvrt-ats.iot.ap-south-1.amazonaws.com",
      "mqtt_topic": "com.orion.iot/" + deviceid,
      "name": this.deviceName ? this.deviceName : 'worvy-home'
    }
    console.log('config to be saved >', data)
    this.httpClient.post(`http://${this.devIp}/config`, data)
      .subscribe(
        resp => {
          this.matgroup.selectedIndex++;
          console.log("config saved > ", resp);
        },
        err => {
          console.log('POST config error', err);
        }
      );
  }

  getExistingConfig() {
    this.httpClient.get(`http://${this.devIp}/config.json`)
      .subscribe(
        (resp: any) => {
          this.previousId = resp.deviceid;
        },
        err => {
          console.log('GET config.json error', err);
        }
      );
  }


  connected(data: string) {
    this.connected$.next(data);
  }

  goToSecure() {
    window.location.href = "https://anothergitdev.github.io/worvy-ui/devices" + (this.previousId ? `?id=${this.previousId}` : '');
  }

  getwifiList() {
    this.httpClient.get(`http://${this.devIp}/wifi-list`)
      .subscribe(
        (resp: any) => {
          console.log('GET wifi-list resposne',resp)
        },
        err => {
          console.log('GET wifi-list error', err);
        }
      );
  }

}
