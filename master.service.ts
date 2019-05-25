import { ValueService } from "./value.service";
import { of } from "rxjs";

@Injectable() 
export class MasterService {
    /**
     *
     */
    constructor(private valueService: ValueService) {
    }

    getValue() {
        return this.valueService.getValue();
    }
}