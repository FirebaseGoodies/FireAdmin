import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fa-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements OnInit {

  @Input() value: string;
  @Input() options: string[];
  @Input() values: string[] = [];
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  isActive(option: string, index: number) {
    return this.value === this.getValue(option, index);
  }

  getValue(option: string, index: number) {
    return this.values && this.values[index] ? this.values[index] : option;
  }

  setValue(option: string, index: number) {
    const value = this.getValue(option, index);
    this.value = value;
    this.valueChange.emit(value);
  }

}
