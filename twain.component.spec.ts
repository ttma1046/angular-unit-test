import { ComponentFixture, TestBed, tick, fak eAsync } from '@angular/core/testing';
import { TwainComponent } from './twain.component';

describe('TwainComponent', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let getQuoteSpy: jasmine.Spy;
  let quoteEl: HTMLElement;

  beforeEach(() => {
    testQuote = 'Test Quote';

    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);

    getQuoteSpy = twainService.getQuote.and.returnValue(of(testQuote));

    // Simulate delayed observable values with the `asyncData()` helper
    getQuoteSpy.and.returnValue(asyncData(testQuote));

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [{ provide: TwainService, useValue: twainService }]
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;

    quoteEl = fixture.nativeElement.querySelector('.twain');
  });

  it('should show quote after component initialized', () => {
    fixture.detectChanges(); // onInit()

    // sync spy result shows testQuote immediately after init
    expect(quoteEl.textContent).toBe(testQuote);
    expect(getQuoteSpy.calls.any()).toBe(true, 'getQuote called');
  });

  it('should display error when TwainService fails', fakeAsync(() => {
    // tell spy to return an error observable
    getQuoteSpy.and.returnValue(throwError('TwainService test failure'));

    fixture.detectChanges(); // onInit()
    // sync spy errors immediately after init

    tick(); // flush the component's setTimeout()

    fixture.detectChanges(); // update errorMessage within setTimeout()

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');
  }));

  it('should show quote after getQuote (fakeAsync)', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit()
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');

    tick(); // flush the observable to get the quote
    fixture.detectChanges(); // update view

    expect(quoteEl.textContent).toBe(testQuote, 'should show quote');
    expect(errorMessage()).toBeNull('should not show error');
  }));

  it('should show quote after getQuote (async)', async(() => {
    fixture.detectChanges(); // ngOnInit()
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');

    fixture.whenStable().then(() => { // wait for async getQuote
      fixture.detectChanges();        // update view with quote
      expect(quoteEl.textContent).toBe(testQuote);
      expect(errorMessage()).toBeNull('should not show error');
    });
  }));

  it('should show last quote (quote done)', (done: DoneFn) => {
    fixture.detectChanges();

    component.quote.pipe( last() ).subscribe(() => {
      fixture.detectChanges(); // update view with quote
      expect(quoteEl.textContent).toBe(testQuote);
      expect(errorMessage()).toBeNull('should not show error');
      done();
    });
  });

  it('should show quote after getQuote (spy done)', (done: DoneFn) => {
    fixture.detectChanges();

    // the spy's most recent call returns the observable with the test quote
    getQuoteSpy.calls.mostRecent().returnValue.subscribe(() => {
      fixture.detectChanges(); // update view with quote
      expect(quoteEl.textContent).toBe(testQuote);
      expect(errorMessage()).toBeNull('should not show error');
      done();
    });
  });

  it('should run timeout callback with delay after call tick with millis', fakeAsync(() => {
    let called = false;
    setTimeout(() => { called = true; }, 100);
    tick(100);
    expect(called).toBe(true);
  }));

  it('should get Date diff correctly in fakeAsync', fakeAsync(() => {
    const start = Date.now();
    tick(100);
    const end = Date.now();
    expect(end - start).toBe(100);
  }));
});

describe('use jasmine.clock()', () => {
  // need to config __zone_symbol__fakeAsyncPatchLock flag
  // before loading zone.js/dist/zone-testing
  beforeEach(() => { jasmine.clock().install(); });
  afterEach(() => { jasmine.clock().uninstall(); });
  it('should auto enter fakeAsync', () => {
    // is in fakeAsync now, don't need to call fakeAsync(testFn)
    let called = false;
    setTimeout(() => { called = true; }, 100);
    jasmine.clock().tick(100);
    expect(called).toBe(true);
  });

  it('should get Date diff correctly in fakeAsync with rxjs scheduler', fakeAsync(() => {
    // need to add `import 'zone.js/dist/zone-patch-rxjs-fake-async'
    // to patch rxjs scheduler
    let result = null;
    of ('hello').pipe(delay(1000)).subscribe(v => { result = v; });
    expect(result).toBeNull();
    tick(1000);
    expect(result).toBe('hello');
 
    const start = new Date().getTime();
    let dateDiff = 0;
    interval(1000).pipe(take(2)).subscribe(() => dateDiff = (new Date().getTime() - start));
 
    tick(1000);
    expect(dateDiff).toBe(1000);
    tick(1000);
    expect(dateDiff).toBe(2000);
  }));
});
