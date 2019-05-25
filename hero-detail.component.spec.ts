import {
  async, ComponentFixture, fakeAsync, inject, TestBed, tick
} from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { newEvent } from './testing';
import { Hero } from './hero';

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

    expect(nameDisplay.textContent).toBe("Quick Brown  Fox");
  });
});