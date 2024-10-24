import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  showOEM: boolean = true;
  showSelectedOEM: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['value'] === 'sub-page') {
        this.showOEM = false;
        this.showSelectedOEM = true;
      }
    });
  }

  oemItems = [
    { name: 'Neat', imageUrl: 'https://avchamps.com/testing/Product-Images/neat_img.png', clickOption: 'Neat' }
  ];

  devices = [
    { name: 'Neat Frame', image: 'https://avchamps.com/testing/Product-Images/neat_frame.jpg', clickOption: 'neatFrame' },
    { name: 'Neat Bar', image: 'https://avchamps.com/testing/Product-Images/sound_bar.png', clickOption: 'neatBar' },
    { name: 'Neat Bar Pro', image: 'https://avchamps.com/testing/Product-Images/sound_bar_pro.jpg', clickOption: 'neatBarPro' }

  ];

  showClickedOEM(option: any) {
    this.showSelectedOEM = true;
    this.showOEM = false;
  }

  showClickedProduct(option: any) {
    this.router.navigate(['product-list-review', option]);
  }
}

