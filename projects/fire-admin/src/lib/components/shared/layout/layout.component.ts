import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { initLayout } from '../../../helpers/layout.helper';

@Component({
  selector: 'fa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  constructor(public settings: SettingsService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    initLayout();
  }

}
