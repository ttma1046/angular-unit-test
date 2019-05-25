import { ValueService } from "./value.service";

describe('ValueService', () => {

    let service: ValueService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ValueService]});
    })

    it('should use ValueService', () => {
        service = TestBed.get(ValueService);
        expect(service.getValue()).toBe('real value');
    });

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ValueService]});
        service = TestBed.get(ValueService);
    })

    it('should use ValueService', () => {
        expect(service.getValue()).toBe('real value');
    });
});