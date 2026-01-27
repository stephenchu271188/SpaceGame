

class SoundManager{
	constructor(params){
		this._game=params.game;
		this.audioElements = {};
		
		this._playing_id_list=new Array();
		this._playing_list=new Array();
		
		this._playing_id_list2=new Array();
		this._playing_id_list3=new Array();
		
		this._lock_sound=false;
		
		let _t_volume=localStorage.getItem("spaceGameVolume");
		if(_t_volume===null)
			_t_volume=1;
		else
			_t_volume=_t_volume/100;
		
		this._volume=_t_volume;
		
		this._load_finish_callback=new Array();
	}
	add_callback_function(_fc){
		this._load_finish_callback.push(_fc);
	}
	load_sounds(_files){
		
		let audioFiles;
		if(typeof _files!='undefined'&&_files!=null)
			audioFiles=_files;
		else
			audioFiles = [
			//{ id: 'blaster', url: './resources/audio/laser-1.mp3' },
			//{ id: 'blaster', url: './resources/audio/BLASTER_Short_Medium_Muffled_stereo.ogg' },
			{ id: 'burst-laser-1', url: './resources/audio/laser-gun-1.mp3' },
			{ id: 'burst-laser-2', url: './resources/audio/laserrocket-1.mp3' },
			{ id: 'blaster1', url: './resources/audio/laser-gun-2.mp3' },
			{ id: 'blaster2', url: './resources/audio/laser-gun-3.mp3' },
            { id: 'explosion1', url: './resources/audio/EXPLOSION_Long_Two_Stage_Burning_then_Smooth_Short.ogg' },
			{ id: 'explosion2', url: './resources/audio/EXPLOSION_Subtle_Bright_Swoosh_stereo.ogg' },
            { id: 'impact-bullet-metal-1', url: './resources/audio/IMPACT_Bullet_Metal_01_mono.ogg' },
			{ id: 'impact-bullet-metal-2', url: './resources/audio/IMPACT_Bullet_Metal_04_mono.ogg' },
            { id: 'impact-bullet-metal-3', url: './resources/audio/IMPACT_Bullet_Metal_05_mono.ogg' },
			{ id: 'magic-spell', url: './resources/audio/MAGIC_SPELL_Slow_Fade_Metallic_Wobble_Echo_stereo.ogg' },
			
            { id: 'thruster1', url: './resources/audio/THRUSTER_Flanger_Shifting_Burning_Air_Muffled_loop.ogg' },
			{ id: 'thruster2', url: './resources/audio/thrusters_loopwav-14699.mp3' },
			{ id: 'thruster3', url: './resources/audio/rocketthrustmaxx-100019.mp3' },
			
			{ id: 'alarm1', url: './resources/audio/alarm1.mp3' },
			{ id: 'alarm2', url: './resources/audio/alarm2.mp3' },
			
			
			{ id: 'missile-launch', url: './resources/audio/missile-blast-2-95177.mp3' },
			{ id: 'rocket-1', url: './resources/audio/rocket/1.mp3' },
			{ id: 'rocket-2', url: './resources/audio/rocket/2.mp3' },
			{ id: 'rocket-3', url: './resources/audio/rocket/3.mp3' },
			{ id: 'rocket-4', url: './resources/audio/rocket/4.mp3' },
			{ id: 'rocket-5', url: './resources/audio/rocket/5.mp3' },
			{ id: 'rocket-6', url: './resources/audio/rocket/6.mp3' },
			{ id: 'rocket-7', url: './resources/audio/rocket/7.mp3' },
			
			{ id: 'machine-gun-1', url: './resources/audio/machine-gun-1.mp3' },
			{ id: 'beam-1', url: './resources/audio/beam-1.mp3' },
			{ id: 'laserrocket-1', url: './resources/audio/lasergun-4.mp3' },
			
			
			{ id: 'speed-up', url: './resources/audio/speed-up-3.mp3' },
			{ id: 'teleport', url: './resources/audio/wind-blow-1.mp3' },
			
			{ id: 'flash-skill', url: './resources/audio/sparkling.mp3' },
			
			//{ id: 'missile-ready', url: './resources/audio/speak/missile-ready.mp3' },
			//{ id: 'main-skill-ready', url: './resources/audio/speak/main-skill-ready.mp3' },
			//{ id: 'sub-skill-ready', url: './resources/audio/speak/sub-skill-ready.mp3' },
        ];
		
		let loadedCount = 0;
        const totalFiles = audioFiles.length;

		
        // Preload each audio file and store in the audioElements object
        audioFiles.forEach(audioFile => {
            const audio = new Audio();
            audio.src = audioFile.url;
            
			audio.addEventListener('canplaythrough', () => {
                loadedCount++;
                if (loadedCount === totalFiles) {
                    // All audio files are loaded
                    //alert('All audio files have been loaded.');
					for(let i=0;i<this._load_finish_callback.length;i++){
						this._load_finish_callback[i]();
					}
                }
            });
			audio.load(); // Preload the audio file
            this.audioElements[audioFile.id] = audio;
        });

	}
	
	speak(_text){
		//try{
		speakText(_text, 'en-US', 1.0, 1.0);
		//}catch(e){alert(e.stack);}
	}
	
	play_player_ship_thruster_sound(){
		this.play2('thruster2');
	}
	stop_player_ship_thruster_sound(){
		this.stop('thruster2');
	}
	
	add_to_playing_list(audio){
		this._playing_audio.push(audio);
		audio.addEventListener('ended', () => {
				const index = this._playing_audio.indexOf(audio);
				if (index !== -1) {
					this._playing_audio.splice(index, 1);
				}
		});
	}
	
	stop(_id){//chi ap dung cho cac audio duoc phat' boi function play2
		for(let i=this._playing_list.length-1;i>=0;i--){
			const audio=this._playing_list[i];
			if(audio._id===_id){
				audio.pause();
				this._playing_list.splice(i,1);
				
				const index = this._playing_id_list.indexOf(_id);
				if (index !== -1) {
					this._playing_id_list.splice(index, 1);
				}
			}
		}
	}
	
	playSound(_id,_unit){
		if(this._lock_sound)return;
		const _max=10;//số lượng tối đa âm thanh cùng một id được phát cùng lúc
		let _counter=0;
		
		for(let i=0;i<this._playing_id_list3.length;i++){
			const _item=this._playing_id_list3[i];
			if(_item.id===_id&&_item.unit===_unit)
				_counter++;
			if(_counter>_max)
				return;
		}
		
		let _volume=1;
		const _distance=_unit.Position.distanceTo(this._game._graphics.Camera.position);
		if(_distance>500)
			_volume=0;
		else if(_distance>400)
			_volume=0.2;
		else if(_distance>300)
			_volume=0.4;
		else if(_distance>200)
			_volume=0.6;
		else if(_distance>100)
			_volume=0.8;
		else
			_volume=1;
		
		_volume*=this._volume;
		if(_volume===0)return;
		//console.log("Volume="+_volume);
		//console.log("DefaultVolume="+this._volume);
		let _new_item={id:_id,unit:_unit};
		this._playing_id_list3.push(_new_item);
		
		if (this.audioElements[_id]) {
			const audio = this.audioElements[_id].cloneNode(true);
			audio.addEventListener('ended', () => {
				// Loại bỏ audio đã phát từ danh sách phát
				const index = this._playing_id_list3.indexOf(_new_item);
				if (index !== -1) {
					this._playing_id_list3.splice(index, 1);
				}
				
			});
			
			audio.volume=_volume;
			audio.play();
			audio._id=_id;
			
		}
	}
	
	play(_id,_volume){
		if(this._lock_sound)return;
		const _max=3;//số lượng tối đa âm thanh cùng một id được phát cùng lúc
		let _counter=0;
		for(let i=0;i<this._playing_id_list2.length;i++){
			if(this._playing_id_list2[i]===_id)
				_counter++;
			if(_counter>_max)
				return;
		}
		
		 if (this.audioElements[_id]) {
                //this.audioElements[_id].play();
				const audio = this.audioElements[_id].cloneNode(true);
				if(!_volume)
					audio.volume=audio.volume=this._volume;
				else
					audio.volume=_volume*this._volume;
				
				audio._id=_id;
				audio.play();
				
				this._playing_id_list2.push(_id);
				audio.addEventListener('ended', () => {
					// Loại bỏ audio đã phát từ danh sách phát
					const index = this._playing_id_list2.indexOf(_id);
					if (index !== -1) {
						this._playing_id_list2.splice(index, 1);
					}
				});
         }
	}
	play2(_id,_volume) {//ko phat 2 audio giong' nhau cung 1 luc, audio2 phai cho audio1 phat xong
		if(this._lock_sound)return;
		// Kiểm tra xem audio có trong danh sách phát không
		if (this._playing_id_list.includes(_id)) {
			return;
		}

		if (this.audioElements[_id]) {
			const audio = this.audioElements[_id].cloneNode(true);
			audio.addEventListener('ended', () => {
				// Loại bỏ audio đã phát từ danh sách phát
				const index = this._playing_id_list.indexOf(_id);
				if (index !== -1) {
					this._playing_id_list.splice(index, 1);
				}
			});
			if(!_volume)
					audio.volume=audio.volume=this._volume;
				else
					audio.volume=_volume*this._volume;
			
			audio.volume=this._volume;
			
			audio.play();
			
			audio._id=_id;
			// Thêm audio vào danh sách phát
			this._playing_id_list.push(_id);
			this._playing_list.push(audio);
		}
}

}

export{SoundManager};

async function speakText(text, lang, rate, pitch) {
   if (!('speechSynthesis' in window)) {
        console.error('Trình duyệt của bạn không hỗ trợ Web Speech API.');
        return;
    }

    // Hàm đợi tải danh sách giọng nói
    function getVoices() {
        return new Promise(resolve => {
            let voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
                return;
            }
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
        });
    }

    const availableVoices = await getVoices();

    // 1. Lọc các giọng nói: Chỉ giữ lại các giọng có ngôn ngữ phù hợp
    let voicesByLang = availableVoices.filter(voice => voice.lang === lang);

    let selectedVoice = null;
    
    // 2. Tìm kiếm Giọng Nữ (Female Voice)
    // Các trình duyệt/hệ điều hành thường đặt tên cho giọng nữ bằng các từ khóa như 'Female', 'Woman', 'F', 'Hà Giang' (cho tiếng Việt), v.v.
    selectedVoice = voicesByLang.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('f')
    );

    // 3. Nếu không tìm thấy giọng nữ, sử dụng giọng đầu tiên có cùng ngôn ngữ
    if (!selectedVoice && voicesByLang.length > 0) {
        selectedVoice = voicesByLang[0];
        console.warn(`Không tìm thấy giọng nữ rõ ràng cho ${lang}. Đã chọn giọng đầu tiên: ${selectedVoice.name}`);
    } else if (!selectedVoice) {
         console.error(`Không tìm thấy bất kỳ giọng nói nào cho ngôn ngữ ${lang}.`);
         return;
    }

    // 4. Bắt đầu đọc
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}