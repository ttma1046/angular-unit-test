import { MasterService } from "./master.service";
import { ValueService } from "./value.service";

describe("MasterService", () => {
    let masterService: MasterService;
    let valueServiceSpy: jasmine.SpyObject<ValueService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ValueService', ['getValue']);

        TestBed.configureTestingModule({
            // Provide both the service-to-test and its (spy) dependency
            providers: [
                MasterService,
                {
                    provide: ValueService, useValue: spy
                }
            ]
        });

        masterService = TestBed.get(MasterService);
        valueServiceSpy = TestBed.get(ValueService);
    });

    it('#getValue should return stubbed value from a spy', () => {
        const stubValue = 'stub value';
        valueServiceSpy.getValue.and.returnValue(stubValue);

        expect(masterService.getValue())
            .toBe(stubValue, 'service returned stub value');
        expect(valueServiceSpy.getValue.calls.count())
            .toBe(1, 'service returned stub value');
        expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
            .toBe(stubValue);
    });
});