import {Utilities} from "./import.js";
import WebElement from "./abstracts/webElement.class.js";

export default class WebGridItem extends WebElement {
    constructor() {
        super();
    }
}

WebElement.build({
	type: WebGridItem,
	observedAttributes: ["grid-column","grid-row","place-self"]
});