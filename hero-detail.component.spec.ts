import {
  async, ComponentFixture, fakeAsync, inject, TestBed, tick
} from '@angular/core/testing';

import { Hero } from './hero';
import { HeroDetailComponent } from './hero-detail.component';
import { newEvent } from './testing/testing';

let component: HeroDetailComponent;
let fixture: ComponentFixture<HeroDetailComponent>;

describe("when navigate to existing hero", () => {
  let firstHero: Hero;
  let expectedHero: Hero;

  function createComponent() {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    // 1st change detection triggers ngOnInit which gets a hero
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched hero
      fixture.detectChanges();
    });
  }

  beforeEach(async(() => {
    expectedHero = firstHero;
    createComponent();
  }));

  it("should convert hero name to Title Case", () => {
    // get the name's input and display elements from the DOM
    const hostElement = fixture.nativeElement;
    const nameInput: HTMLInputElement = hostElement.querySelector("input");
    const nameDisplay: HTMLElement = hostElement.querySelector("span");

    // simulate user entering a new name into the input box
    nameInput.value = "quick BROWN  fOx";

    // dispatch a DOM event so that Angular learns of input value change.
    nameInput.dispatchEvent(newEvent("input"));

    // Tell Angular to update the display binding through the title pipe
    fixture.detectChanges();

    expect(nameDisplay.textContent).toBe("Quick Brown Fox");
  });
});

describe('when navigate to existing hero', () => {
  let expectedHero: Hero;

  beforeEach(async(() => {
    expectedHero = firstHero;
    activatedRoute.setParamMap({ id: expectedHero.id });
    createComponent();
  }));

  it('should display that hero\'s name', () => {
    expect(page.nameDisplay.textContent).toBe(expectedHero.name);
  });
});

describe('when navigate to non-existent hero id', () => {
  beforeEach(async(() => {
    activatedRoute.setParamMap({ id: 99999 });
    createComponent();
  }));

  it('should try to navigate back to hero list', () => {
    expect(page.gotoListSpy.calls.any()).toBe(true, 'comp.gotoList called');
    expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
  });
});

describe('when navigate with no hero id', () => {
  beforeEach(async( createComponent ));

  it('should have hero.id === 0', () => {
    expect(component.hero.id).toBe(0);
  });

  it('should display empty hero name', () => {
    expect(page.nameDisplay.textContent).toBe('');
  });
});
