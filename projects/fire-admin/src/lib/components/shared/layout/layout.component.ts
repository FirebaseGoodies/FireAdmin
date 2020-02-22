import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'fa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public settings: SettingsService) { }

  ngOnInit() {
  }

  

}
