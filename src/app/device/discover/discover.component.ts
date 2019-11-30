import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent, MatStep, MatStepLabel, MatStepper } from '@angular/material';

import { first, switchMap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'worvy-ui-insecure/src/app/core/models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  // @ViewChild('matgroup', { static: true }) matgroup: MatTabGroup;
  @ViewChild('stepper', { static: true }) matStepper: MatStepper;

  hosts: string[] = ['192.168.4.1', '172.217.28.1'];
  public connected$ = new BehaviorSubject<string>('');
  public connState: boolean;
  location: Location;
  accountRef: any = {};

  constructor(
    private httpClient: HttpClient,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.connected$.subscribe(connected => {
      if (connected) {
        localStorage.setItem('connected', connected);
        console.log("Connected: ", connected);
      }
    }, err => console.log(err));

    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe(data => {
      this.accountRef.userid = data.uid;
      this.accountRef.accountid = data.accountid;
    })
  }
// 
  // *ngIf="afAuth.authState | async as user; else loginheader"
  // nextTab(tabGroup: MatTabGroup) {
  //   if (tabGroup.selectedIndex < tabGroup._tabs.length - 1) {
  //     this.matgroup.selectedIndex++;
  //   } else {
  //     this.matgroup.selectedIndex = 0;
  //   }
  // }

  nextStep(stepGrp: MatStepper) {
    console.log('stepGrp ', stepGrp, this.matStepper.selectedIndex);
    if (this.matStepper.selectedIndex == 0) {
      console.log('redirecting to in secure page...')
      this.goToInSecure();
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

  goToInSecure() {
    console.log('btoa(this.accountRef) ', btoa(JSON.stringify(this.accountRef)));
    window.location.href = "http://worvy-ui.s3-website.ap-south-1.amazonaws.com/discover?referer=" + btoa(JSON.stringify(this.accountRef));
  }

}
