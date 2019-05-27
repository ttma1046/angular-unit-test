import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from './hero';
import { click } from './testing';

@Component({
  template: `
    <dashboard-hero [hero]="hero" (selected)="onSelected($event)">
    </dashboard-hero>
  `,
})
class TestHostComponent {
  hero: Hero = { id: 42, name: 'Test Name' };
  selectedHero: Hero;
  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}

describe('Description', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;
  let heroEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHeroComponent, TestHostComponent]
    });
    // create TestHostComponent instead of DashboardHeroComponent
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    heroEl = fixture.nativeElement.querySelector('.hero');
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should display hero name', () => {
    const expectedPipedName = testHost.hero.name.toUpperCase();
    expect(heroEl.textContent).toContain(expectedPipedName);
  });

  it('should raise selected event when clicked', () => {
    click(heroEl);
    // selected hero should be the same data bound hero
    expect(testHost.selectedHero).toBe(testHost.hero);
  });
});
