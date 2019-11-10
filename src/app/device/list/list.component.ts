import { Component, OnInit } from '@angular/core';

import { DeviceService } from '../device.service';
import { timer, Observable, interval } from 'rxjs';
import { concatMap, map, flatMap } from 'rxjs/operators';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  devices$;
  pollingDevices$: Observable<any>;
  devices;
  loading: boolean = true;
  constructor(public deviceService: DeviceService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      // this.pollingDevices$ = timer(0, 1000).pipe(
      //   concatMap(_ => devices$),
      //   map((devices => this.devices = devices)));
      // this.pollingDevices$.subscribe((devices: any) => this.devices = devices);
      // get our data every subsequent 10 seconds
      this.devices$ = timer(0, 5000).pipe(
        flatMap(() => this.deviceService.getDevices())
      ).subscribe((devices: any) => this.devices = devices);

    }, 1000);
  }

  ngOnDestroy() {
    this.devices$.unsubscribe();
  }



}
