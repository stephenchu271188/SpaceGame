import {Base} from './base.js';

class ServiceBase extends Base{
	constructor(params){
		super(params);
		this._type="service";
	};
}
export{ServiceBase};