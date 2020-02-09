import { Component, OnInit, AfterViewInit } from '@angular/core';
import { initDropdown } from '../../helpers/pages.helper';

@Component({
  selector: 'fa-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    initDropdown();
  }

}
