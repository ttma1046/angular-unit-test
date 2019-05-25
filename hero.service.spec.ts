import { Hero } from "./hero";
import { asyncData, asyncError } from "./async-observable-helpers";

describe('HeroService', () => {
    let heroService: HeroService;
    let httpClientSpy: { get: jasmine.Spy };

    beforeEach(() => {
        // TODO: spy on other methods too
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        heroService = new heroService(<any>httpClientSpy);
    });

    it('should return expected heroes (HttpClient called once)', () => {
        const expectedHeroes: Hero[] = [
            { id: 1, name: 'A'}, { id: 2, name: 'B'}
        ];

        httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

        heroService.getHeroes().subscribe(
            heroes => expect(heroes).toEqual(expectedHeroes, 'expected heroes'),
            fail
        );
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    });

    it('should return an error when the server returns a 404', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404, statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        heroService.getHeroes().subscribe(
            heroes => fail('expected an error, not heroes'),
            error => expect(error.messge).toContain('test 404 error')
        )
    })
})