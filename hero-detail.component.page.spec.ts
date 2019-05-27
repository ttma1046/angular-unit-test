import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroDetailComponent } from './hero-detail.component';

let fixture: ComponentFixture<HeroDetailComponent>;
let component: HeroDetailComponent;
let page: Page;

class Page {
    // getter properties wait to query the DOM until called.
    get buttons() { return this.queryAll<HTMLButtonElement>('button'); }
    get saveBtn() { return this.buttons[0]; }
    get cancelBtn() { return this.buttons[1]; }
    get nameDisplay() { return this.query<HTMLElement>('span'); }
    get nameInput() { return this.query<HTMLInputElement>('input'); }

    gotoListSpy: jasmine.Spy;
    navigateSpy: jasmine.Spy;

    constructor(thisfixture: ComponentFixture<HeroDetailComponent>) {
        // get the navigate spy from the injected router spy object
        const routerSpy = thisfixture.debugElement.injector.get(Router);
        this.navigateSpy = routerSpy.navigate;

        // spy on component's `gotoList()` method
        const component = thisfixture.componentInstance;
        this.gotoListSpy = spyOn(component, 'gotoList').and.callThrough();
    }

    //// query helpers ////
    private query<T>(selector: string): T {
        return fixture.nativeElement.querySelector(selector);
    }

    private queryAll<T>(selector: string): T[] {
        return fixture.nativeElement.querySelectorAll(selector);
    }
}

/** Create the HeroDetailComponent, initialize it, set test variables  */
function createComponent() {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    // 1st change detection triggers ngOnInit which gets a hero
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched hero
        fixture.detectChanges();
    });
}

describe('HeroDetailComponent', () => {
    it('should display that hero\'s name', () => {
        expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });

    it('should navigate when click cancel', () => {
        click(page.cancelBtn);
        expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click save but not navigate immediately', () => {
        // Get service injected into component and spy on its`saveHero` method.
        // It delegates to fake `HeroService.updateHero` which delivers a safe test result.
        const hds = fixture.debugElement.injector.get(HeroDetailService);
        const saveSpy = spyOn(hds, 'saveHero').and.callThrough();

        click(page.saveBtn);
        expect(saveSpy.calls.any()).toBe(true, 'HeroDetailService.save called');
        expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should navigate when click save and save resolves', fakeAsync(() => {
        click(page.saveBtn);
        tick(); // wait for async save to complete
        expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('should convert hero name to Title Case', () => {
        // get the name's input and display elements from the DOM
        const hostElement = fixture.nativeElement;
        const nameInput: HTMLInputElement = hostElement.querySelector('input');
        const nameDisplay: HTMLElement = hostElement.querySelector('span');

        // simulate user entering a new name into the input box
        nameInput.value = 'quick BROWN  fOx';

        // dispatch a DOM event so that Angular learns of input value change.
        nameInput.dispatchEvent(newEvent('input'));

        // Tell Angular to update the display binding through the title pipe
        fixture.detectChanges();

        expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
    });
});