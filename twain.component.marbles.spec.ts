import { cold, getTestScheduler } from 'jasmine-marbles';

describe('', () => {
    it('should show quote after getQuote (marbles)', () => {
        // observable test quote value and complete(), after delay
        const q$ = cold('---x|', { x: testQuote });
        getQuoteSpy.and.returnValue(q$);

        fixture.detectChanges(); // ngOnInit()
        expect(quoteEl.textContent).toBe('...', 'should show placeholder');

        getTestScheduler().flush(); // flush the observables

        fixture.detectChanges(); // update view

        expect(quoteEl.textContent).toBe(testQuote, 'should show quote');
        expect(errorMessage()).toBeNull('should not show error');
    });
});
