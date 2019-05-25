import { of } from 'rxjs';

export class ValueService {

    protected value = 'real value';

    getValue() {
        return this.value;
    }

    getObservableValue() {
        return of('observalbe value');
    }

    getPromiseValue() { return Promise.resolve('promise value'); }
}