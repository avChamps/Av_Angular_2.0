import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-coins-blast',
  templateUrl: './coins-blast.component.html',
  styleUrls: ['./coins-blast.component.css']
})
export class CoinsBlastComponent implements OnInit {
  @Input() coins: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // this.blastConfetti();
  }

  ngOnInit(): void {
    this.blastConfetti();
  }

  blastConfetti() {
    const container = this.el.nativeElement.querySelector('.confetti-container');
    container.innerHTML = '';

    for (let i = 0; i < 100; i++) {
      const confetti = this.renderer.createElement('div');
      this.renderer.addClass(confetti, 'confetti');

      const width = `${Math.random() * 10 + 5}px`; 
      const height = `${Math.random() * 30 + 10}px`; 
      this.renderer.setStyle(confetti, 'width', width);
      this.renderer.setStyle(confetti, 'height', height);

      const colors = ['#f9ca24', '#e056fd', '#ff4757', '#1e90ff', '#2ed573', '#ffa502', '#ff6b81'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      this.renderer.setStyle(confetti, 'background', randomColor);
      this.renderer.setStyle(confetti, 'left', `${Math.random() * 100}%`);
      this.renderer.setStyle(confetti, 'top', `${Math.random() * 100}%`);
      const randomRotation = `${Math.random() * 1080 - 540}deg`;
      this.renderer.setStyle(confetti, 'animation', `confetti-up ${Math.random() * 2 + 1.5}s ease-out forwards`);
      this.renderer.setStyle(confetti, 'transform', `rotate(${randomRotation})`);
      this.renderer.appendChild(container, confetti);
    }

    const lid = this.el.nativeElement.querySelector('.lid');
    this.renderer.setStyle(lid, 'animation', 'lid-open 0.5s forwards');
  }

}
