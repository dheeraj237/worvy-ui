import { Component, OnInit } from '@angular/core';

import { DeviceService } from '../device.service';
import { timer, Observable, interval } from 'rxjs';
import { concatMap, map, flatMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


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
  constructor(
    public deviceService: DeviceService,
    private route: ActivatedRoute,
    private httpClient: HttpClient
    ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(qparams => {
      console.log('qparams ', qparams);
      if (qparams.id) {
        let params = new HttpParams();
        this.httpClient.delete(`${environment.apiendpoint}/device`, { params: params.append('id', qparams.id) }).subscribe(
          (_) => {
            console.log('config deleted.')
          },
          err => {
            console.log('config delete error', err);
          }
        );
      }
    });
    setTimeout(() => {
      this.loading = false;
      // this.pollingDevices$ = timer(0, 1000).pipe(
      //   concatMap(_ => devices$),
      //   map((devices => this.devices = devices)));
      // this.pollingDevices$.subscribe((devices: any) => this.devices = devices);
      // get our data every subsequent 10 seconds
      this.devices$ = timer(0, 10000).pipe(
        flatMap(() => this.deviceService.getDevices())
      ).subscribe((devices: any) => this.devices = devices);

    }, 1000);
  }

  ngOnDestroy() {
    this.devices$.unsubscribe();
  }



}
