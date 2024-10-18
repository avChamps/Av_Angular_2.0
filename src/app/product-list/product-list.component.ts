import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  showOEM: boolean = false;
  showSelectedOEM: boolean = true;

  oemItems = [
    { name: 'Neat', imageUrl: 'https://avchamps.com/testing/Product-Images/neat_img.png', clickOption: 'Neat' }
  ];


  devices = [
    { name: 'Neat Frame', image: 'https://avchamps.com/testing/Product-Images/neat_frame.jpg' },
    { name: 'Neat Bar', image: 'https://avchamps.com/testing/Product-Images/sound_bar.png' },
    { name: 'Neat Bar Pro', image: 'https://avchamps.com/testing/Product-Images/sound_bar_pro.jpg' }

  ];

  showClickedOEM(option: any) {
    this.showSelectedOEM = true;
    this.showOEM = false;
    alert(option);
  }

}

