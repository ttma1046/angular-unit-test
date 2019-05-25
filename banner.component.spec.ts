import { BannerComponent } from "./banner.component";

describe('BannerComponent', () => {
    let component: BannerComponent;
    let fixture: ComponentFixture<BannerComponent>;
    let h1: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannerComponent],
        });
        fixture = TestBed.createComponent(BannerComponent);
        component = fixture.componentInstance; // BannerComponent test instance
        h1 = fixture.nativeElement.querySelector('h1');
    });

    it('no title in the DOM after createComponent()', () => {
        expect(h1.textContent).toEqual('');
    });

    it('should display original title', () => {
        fixture.detectChanges();
        expect(h1.textContent).toContain(component.title);
    });

    it('should display a different test title', () => {
        component.title = 'Test Title';
        fixture.detectChanges();
        expect(h1.textContent).toContain('Test Title');
    });
});
