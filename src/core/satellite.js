import {SphericalObject} from './spherical-object.js';

class Satellite extends SphericalObject{
	constructor(params){
		super(params);
		this._planet=params.planet;
	}
}

export { Satellite };