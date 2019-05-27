import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { Hero } from './hero';

describe('DashboardHeroComponent', () => {
  let fixture: ComponentFixture<DashboardHeroComponent>;
  let comp: DashboardHeroComponent;
  let heroDe: DebugElement;
  let heroEl: HTMLElement;
  let expectedHero: Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHeroComponent],
    });
    fixture = TestBed.createComponent(DashboardHeroComponent);
    comp = fixture.componentInstance;

    // find the hero's DebugElement and element
    heroDe = fixture.debugElement.query(By.css('.hero'));
    heroEl = heroDe.nativeElement;

    // mock the hero supplied by the parent component
    expectedHero = { id: 42, name: 'Test Name' };

    // simulate the parent setting the input property with that hero
    comp.hero = expectedHero;

    // trigger initial data binding
    fixture.detectChanges();
  });

  it('should display hero name in uppercase', () => {
    const expectedPipedName = expectedHero.name.toUpperCase();
    expect(heroEl.textContent).toContain(expectedPipedName);
  });

  it('should raise selected event when clicked (triggerEventHandler)', () => {
    let selectedHero: Hero;
    comp.selected.subscribe((hero: Hero) => selectedHero = hero);

    heroDe.triggerEventHandler('click', null);
    expect(selectedHero).toBe(expectedHero);
  });

  it('raises the selected event when clicked', () => {
    const comp = new DashboardHeroComponent();
    const hero: Hero = { id: 42, name: 'Test' };
    comp.hero = hero;

    comp.selected.subscribe((selectedHero: Hero) => expect(selectedHero).toBe(hero));
    comp.click();
  });
});
