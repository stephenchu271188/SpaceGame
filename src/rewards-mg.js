

class RewardsMG{
	constructor(params){
		this._params=params;
		this._game=params.game;
		
		this._player_rewards_data=[];
		this._ship_rewards_data=[];
		this._space_tunnel_rewards_data=[];
		
		this.load_player_reward_data();
		this.load_ship_reward_data();
		this.load_space_tunnel_reward_data();
		
		let _rocket2_level_rq=this._game._unitMG.get_rocket_level_require(2);
		let _rocket3_level_rq=this._game._unitMG.get_rocket_level_require(3);
		let _photon_armour_level_rq=this._game._parameters.get_armour_ship_level_require(1);
		
		this._rewards_1=[//cac phan thuong khi player-ship dat level yeu cau
		
			{
				level:_rocket2_level_rq,
				fc:(_ship_id,_level)=>{
					let _missile_2_level_require=this._game._unitMG.get_rocket_level_require(2);//level cua ship de duoc kich hoat missile2
					if(_missile_2_level_require===_rocket2_level_rq){
						//this._game._warehouse.add_rocket_num(2,10);
						/*
							Hien phan thuong rocket de trong show-room-rocket-panel.js cho thuan tien
							Co le sau nay phai tim cach chuyen doan code do ve day
						*/
						this._game.createMessageBox("Notification",
						"Rocket 2 has been activated!",
						()=>{
							
						});
						this._game._show_room.change_effect(this._game._show_room._rocket_btn,true);
						
					}
				}
			},
			{
				level:_rocket3_level_rq,//level 4
				fc:(_ship_id,_level)=>{
					let _missile_3_level_require=this._game._unitMG.get_rocket_level_require(3);//level cua ship de duoc kich hoat missile2
					if(_missile_3_level_require===_rocket3_level_rq){
						this._game.createMessageBox("Notification",
						"Rocket 3 has been activated, you can buy and equip your ship",
						()=>{
							
						});
					}
				}
			},
			{
				level:_photon_armour_level_rq,//level 4
				fc:(_ship_id,_level)=>{
					this._inform_new_armour_activated();
				}
			},
			{
				level:3,
				fc:(_ship_id,_level)=>{
					this._inform_new_skill_activated();
					
				}
			}
			,
			{
				level:4,
				fc:(_ship_id,_level)=>{
					this._reward_infinity_stone(_ship_id,_level,10);
					this._reward_dark_energy(_ship_id,_level,10);
				}
			}
			,
			{
				level:5,//co the mua them slot rocket
				fc:(_ship_id,_level)=>{
					this._inform_new_skill_activated();
					this._reward_dark_energy(_ship_id,_level,10);
					this._reward_infinity_stone(_ship_id,_level,10);
				}
			}
			
			,
			{
				level:6,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,10);
					this._reward_infinity_stone(_ship_id,_level,15);
				}
			}
			,
			{
				level:7,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,10);
					this._reward_infinity_stone(_ship_id,_level,20);
				}
			},
			{
				level:8,
				fc:(_ship_id,_level)=>{
					/*
					let _dark_energy_num=30;
					let _dark_energy_id=2001;//trong item-package.js
					this._game._item_package.add_item(_dark_energy_id,_dark_energy_num);
					this._game.createMessageBox("Notification",
						"Bạn đã nhận được "+_dark_energy_num+" đơn vị năng lượng tối hãy sử dụng để nâng cấp kỹ năng phụ!!",
						()=>{
							
						});
						*/
					this._reward_infinity_stone(_ship_id,_level,20);
					this._reward_dark_energy(_ship_id,_level,20);
				}
			},
			
			{
				level:9,
				fc:(_ship_id,_level)=>{
					/*
					let _dark_matter_num=30;
					let _dark_matter_id=1001;//trong item-package.js
					this._game._item_package.add_item(_dark_matter_id,_dark_matter_num);
					this._game.createMessageBox("Notification",
						"Bạn đã nhận được "+_dark_matter_num+" đơn vị vật chất tối hãy sử dụng để nâng cấp tàu phụ!!",
						()=>{
							
						});
						*/
						this._reward_dark_energy(_ship_id,_level,30);
						this._reward_infinity_stone(_ship_id,_level,20);
						//this._reward_dark_matter(_ship_id,_level,30);
				}
			},
			{
				level:10,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,30);
					this._reward_infinity_stone(_ship_id,_level,30);
				}
			},
			{
				level:11,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,30);
					this._reward_infinity_stone(_ship_id,_level,30);
				}
			},
			{
				level:12,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,30);
					this._reward_infinity_stone(_ship_id,_level,30);
				}
			},
			{
				level:13,
				fc:(_ship_id,_level)=>{
					this._reward_dark_energy(_ship_id,_level,30);
					this._reward_infinity_stone(_ship_id,_level,30);
				}
			},
		];
		this._inform_new_armour_activated=()=>{
			this._game.createMessageBox("Notification",
						"New armor is now available for purchase and equipping!",
						()=>{
							
						});
			this._game._show_room.change_effect_2(this._game._show_room._armour_btn,true);
		};
		this._inform_new_skill_activated=()=>{
			this._game.createMessageBox("Notification",
						"New skill can be activated, you can buy and equip!",
						()=>{
							
						});
			this._game._show_room.change_effect_2(this._game._show_room._add_skill_btn,true);
		};
		this._reward_lucky_wheel_turn=(_num)=>{
			let _lucky_wheel_turn_id=-1;//trong item-package.js
			this._game._item_package.add_item(_lucky_wheel_turn_id,_num);
			this._game.createMessageBox("Notification",
				"You have received "+_num+" lucky spins!",
				()=>{
							
			});
		};
		this._reward_dark_energy=(_ship_id,_level,_num)=>{
			let _dark_energy_num=_num;
			let _dark_energy_id=2001;//trong item-package.js
			this._game._item_package.add_item(_dark_energy_id,_dark_energy_num);
			this._game.createMessageBox("Notification",
				"You have received "+_dark_energy_num+" units of dark energy, use it to upgrade your secondary skills.",
				()=>{
							
			});
		};
		this._reward_dark_matter=(_ship_id,_level,_num)=>{
			let _dark_matter_id=1001;//trong item-package.js
			this._game._item_package.add_item(_dark_matter_id,_num);
			this._game.createMessageBox("Notification",
						"You have received "+_num+" units of dark matter, use it to upgrade your secondary skills.",
						()=>{
							
						});
		};
		this._reward_infinity_stone=(_ship_id,_level,_num)=>{
			let _infinity_stone_num=_num;
			let _infinity_stone_id=this._game._unitMG.get_player_ship_skill_upgrade_item_require_id(_ship_id);
			this._game._item_package.add_item(_infinity_stone_id,_infinity_stone_num);
			this._game.createMessageBox("Notification",
						"You are given "+_infinity_stone_num+" infinity stones that can be used to upgrade your main skills!",
						()=>{
							
						});
			//this._game._show_room._skill_btns[1];
			try{
				this._game._show_room.change_effect_2(this._game._show_room._skill_btns[1],true);
			}catch(e){
				alert(e.stack);
			}
			
		};
		
		this._rewards_2=[//cac phan thuong khi player-level dat yeu cau
			{
				level:2,
				fc:()=>{
					this._reward_dark_matter(null,null,5);
					this._reward_lucky_wheel_turn(5);
				}
			},
			{
				level:3,//luu y _infor.player_level ben duoi
				fc:()=>{
					for(let i=0;i<this._game._unitMG._player_ship_infors.length;i++){
						const _infor=this._game._unitMG._player_ship_infors[i];
						if(_infor.player_level===3){
							//this._game._show_room.move_to_2(2);//<==
							this._game.createMessageBox("Notification",
									"New ship unlocked!",
									()=>{
							
									});
					        break;
						}
					}
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:4,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:5,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:6,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:7,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:8,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
			{
				level:9,
				fc:()=>{
					this._reward_dark_matter(null,null,10);
					this._reward_lucky_wheel_turn(10);
				}
			},
		];
		
		this._rewards_3=[//cac phan thuong khi vuot qua level trong space-tunnel mode
		
			{
				level:1,
				fc:()=>{
					
					try{
						let _rocket_ids=this._game._show_room._ship_package.get_rocket_in_compartment_id();
					    //alert(_rocket_ids);
						let num1=this._game._show_room._ship_package.get_rocket_num(_rocket_ids[0]);
						let num2=this._game._show_room._ship_package.get_rocket_num(_rocket_ids[1]);
						let num3=this._game._show_room._ship_package.get_rocket_num(_rocket_ids[2]);
						let num4=this._game._show_room._ship_package.get_rocket_num(_rocket_ids[3]);
						let _max_rocket_num=this._game._show_room._ship_package.get_max_rocket_num();
						//alert(_max_rocket_num);
						
						let _num=_max_rocket_num-(num1+num2+num3+num4);
						if(_num>0){
							let _rocket_id=8
							if(this._game._unitMG.get_rocket_infor(_rocket_id)!=null){
								this._game._show_room._ship_package.set_rocket_num(_rocket_id,_num);
								this._game._show_room._ship_package.save_data();
								this._game._show_room.change_effect(this._game._show_room._rocket_btn,true);
								//this._game._show_room.show_arrow(this._game._show_room._rocket_btn);
								let _arrow=this._game._show_room.show_arrow(this._game._show_room._rocket_btn,"-60px","0px");
								setTimeout(()=>{
									_arrow.remove();
								},10000);
								this._game.createMessageBox("Notification",
									"You have been given some missiles",
									()=>{
							
									});
							}
							
						}
						
						/*
						this._game._show_room._ship_package.add_ship_passive_skill(1);
						this._game.createMessageBox("Notification",
						"You have been given new passive skill",
						()=>{
							
						});
						*/
					}
					catch(e){alert(e.stack);}
					/*
					try{
						//this._game._warehouse.add_rocket_num(8,5);
					}catch(e){};
					this._game._show_room.change_effect(this._game._show_room._rocket_btn,true);
					this._game.createMessageBox("Notification",
						"You have been given some missiles",
						()=>{
							
						});
						*/
				}
			},
		];
	}
	
	load_player_reward_data(){
		let _data=this._game.get_data_in_local_storage('player_rewards_data');
		if(_data!=null){
			this._player_rewards_data=_data;
		}
	}
	save_player_reward_data(){
		this._game.update_data_in_local_storage('player_rewards_data',this._player_rewards_data);
		
	}
	
	load_ship_reward_data(){
		let _data=this._game.get_data_in_local_storage('ship_rewards_data');
		if(_data!=null){
			this._ship_rewards_data=_data;
		}
	}
	save_ship_reward_data(){
		this._game.update_data_in_local_storage('ship_rewards_data',this._ship_rewards_data);
		
	}
	
	load_space_tunnel_reward_data(){
		let _data=this._game.get_data_in_local_storage('space_tunnel_rewards_data');
		if(_data!=null){
			this._space_tunnel_rewards_data=_data;
		}
	}
	save_space_tunnel_reward_data(){
		this._game.update_data_in_local_storage('space_tunnel_rewards_data',this._space_tunnel_rewards_data);
		
	}
	
	reward_player_level(_level){//trao thuong khi player dat level
		this._player_rewards_data.push({
			level:_level,
			date:null,
			notification:null,
		});
	}
	reward_ship_level(_ship_id,_level){
		this._ship_rewards_data.push({
			ship_id:_ship_id,
			level:_level,
			date:null,
			notification:null,
		});
	}
	reward_space_tunnel_level(_level){
		this._space_tunnel_rewards_data.push({
			level:_level,
			date:null,
			notification:null,
		});
	}
	
	check_player_level_reward(_level1){
		for(let i=_level1-6;i<=_level1;i++){//co the co truong hop 1 luc len nhieu level
			this.check_reward_1(i,this._player_rewards_data,this._rewards_2);
		}
	}
	check_ship_level_reward(_ship_id,_level1){//alert("Level1="+_level1);
		for(let i=_level1-6;i<=_level1;i++){//co the co truong hop 1 luc len nhieu level
			this.check_reward_2(_ship_id,i,this._ship_rewards_data,this._rewards_1);
		}
	}
	check_space_tunnel_level_reward(_level1){
		this.check_reward_3(_level1);
	}
	/*
	check_all_space_tunnel_level_reward(){
		for(let i=1;i<=10;i++){
			this.check_space_tunnel_level_reward(i);
		}
	};
	*/
	check_reward_1(_level1,_list1,_list2){
		for(let i=0;i<_list1.length;i++){
			let _reward=this._player_rewards_data[i];
			let _level2=_reward.level;
			
			if(_level1===_level2){
				return false;
			}
		}
		this.reward_player_level(_level1);
		for(let i=0;i<_list2.length;i++){
			let _reward=_list2[i];
			let _level2=_reward.level;
			let _fc=_reward.fc;
			
			if(_level1===_level2){
				_fc();
				this.save_player_reward_data();
				//this.save_ship_reward_data();
				//return true;
			}
		}
		return true;
	}
	
	check_reward_2(_ship_id,_level1){
		//alert("ShipLevel="+this._game._show_room.get_focus_ship()._ship_package.get_ship_level());
		for(let i=0;i<this._ship_rewards_data.length;i++){
			let _reward=this._ship_rewards_data[i];
			let _id=_reward.ship_id;
			let _level2=_reward.level;
			
			if(_id===_ship_id&&_level1===_level2){
				return false;
			}
		}
		this.reward_ship_level(_ship_id,_level1);
		//alert("ShipID="+_ship_id);
		for(let i=0;i<this._rewards_1.length;i++){
			let _reward=this._rewards_1[i];
			let _level2=_reward.level;
			let _fc=_reward.fc;//alert(_level1+" and "+_level2);
			if(_level1===_level2){
				_fc(_ship_id,_level1);
				this.save_ship_reward_data();//alert("rewarded");
				//return true;
			}
		}
		return true;
	}
	
	check_reward_3(_level1){
		
		let _current_level=this._game.get_data_in_database("space-tunnel-level");
		//_current_level=5;
		if(!_current_level||_current_level==null){
			return;
		}
		else{
			_current_level=parseInt(_current_level);
			if(_current_level<_level1)
				return;
		}
		
		for(let i=0;i<this._space_tunnel_rewards_data.length;i++){
			let _reward=this._space_tunnel_rewards_data[i];
			let _level2=_reward.level;
			
			if(_level1===_level2){
				return false;
			}
		}
		this.reward_space_tunnel_level(_level1);
		for(let i=0;i<this._rewards_3.length;i++){
			let _reward=this._rewards_3[i];
			let _level2=_reward.level;
			let _fc=_reward.fc;//alert(_level1+" and "+_level2);
			if(_level1===_level2){
				_fc(_level1);
				this.save_space_tunnel_reward_data();
				//return true;
			}
		}
		return true;
	}
}

export {RewardsMG}