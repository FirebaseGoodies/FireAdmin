import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }

}
