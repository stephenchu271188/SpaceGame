import {Star} from './star.js';

class Sun extends Star{
	create(){
		this._params.texture_url="./texture/sunmap.jpg";
		super.create();
	}
}

export { Sun };