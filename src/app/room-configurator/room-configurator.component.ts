import { Component } from '@angular/core';

export enum DisplaySection {
  First = 'first',
  Second = 'second',
  Third = 'third',
  Fourth = 'fourth',
  Fifth = 'fifth',
  Sixth = 'sixth'
}

@Component({
  selector: 'app-room-configurator',
  templateUrl: './room-configurator.component.html',
  styleUrls: ['./room-configurator.component.css']
})
export class RoomConfiguratorComponent {
  currentTab = DisplaySection.First;
  DisplaySection = DisplaySection; 

  onSelect(type :any) {
    if(type == 'first') {
      this.currentTab = DisplaySection.Second;
    }
  }

  

}
