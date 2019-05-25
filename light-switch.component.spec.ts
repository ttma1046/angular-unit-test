import { LightswitchComponent } from "./light-switch.component";

describe('LightswitchComp', () => {
    it('#clicked() should toggle #isOn', () => {
        const comp = new LightswitchComponent();
        expect(comp.isOn).toBe(false, 'off at first');
        comp.clicked();
        expect(comp.isOn).toBe(true, 'on after click');
        comp.clicked();
        expect(comp.isOn).toBe(false, 'off after second click');
    })

    it('#clicked() should set #message to "is on"', () => {
        const comp = new LightswitchComponent();
        expect(comp.message).toMatch(/is off/i, 'off at first');
        comp.clicked();
        expect(comp.message).toMatch(/is on/i, 'on after clicked');
    })  
})