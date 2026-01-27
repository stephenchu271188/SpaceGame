

class ImagePreloader {
    constructor(params) {
        this._game=params.game;
        //this.preloadImages();
    }

    preloadImages(imageUrls, callback) {
		this.imageUrls = imageUrls;
        this.callback = callback;
        this.loadedCounter = 0;
        this.images = [];
		
        for (let i = 0; i < this.imageUrls.length; i++) {
            const img = new Image();
            img.onload = () => this.imageLoaded();
            img.onerror = () => this.imageLoaded();
            img.src = this.imageUrls[i][1];
			let imgID=this.imageUrls[i][0];
            this.images.push([imgID,img]);
        }
    }

    imageLoaded() {
        this.loadedCounter++;
        if (this.loadedCounter === this.imageUrls.length) {
            this.callback();
        }
    }
	
	getImage(_id1){
		for(let i=0;i<this.images.length;i++){
			const _element=this.images[i];
			const _id2=_element[0];
			if(_id1===_id2)return _element[1];
		}
		return null;
	}
}

export {ImagePreloader}