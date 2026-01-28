
var _game_paramters;
class GameParameters{
	constructor(params){
		this._game=params.game;
		this._game_mode_PvC=1;//Player Vs Computer Mode
		this._game_mode_PvP=2;//Player Vs Player Mode
		
		_game_paramters=this;
		
		this._defend_planet_mode_rank_require=2;//rank phai dat duoc de duoc choi che do nay
		this._defend_base_mode_rank_require=3;//rank phai dat duoc de duoc choi che do nay
		this._combat_mode_rank_require=3;//rank phai dat duoc de duoc choi che do nay
		this._discovery_universe_mode_rank_require=6;
		
		this._standard_hp=1000;//HP của enemy-ship yếu nhất(space-ship-1) level1, sử dụng để làm cơ sở tính hp và dammage của các unit khác
		this._standard_price=100;//giá 1 quả missile-1, sử dụng làm cơ sở tính giá các unit khác
		this._standard_reward=this._standard_price*20;//money sau khi tieu diet 1 ship
		
		this._standard_exp_1=1000;//exp cần có để level account(ko phải ship) của player tăng từ level1->level2
		this._standard_exp_2=20;//exp nhận được khi tiêu diệt 1 unit yếu nhất ở level thấp nhất
		
		this._init_cash=this._standard_price*15000;//so tien` lan dau dang nhap vao game duoc nhan
		this._init_rocket_slot=10;//so luong rocket co the chua' duoc
		this._price_add_1_rocket_slot=this._standard_price*150;//them 1 slot rocket vao khoang cua player-ship
		
		this._unit_main_skill_max_level=10;
		
		this._levels_required_to_add_rocket_slots=[2,7,12,17,22,27,32,37,42,47,52,57,
													62,67,72,77,82];//cac ship level yeu cau de duoc unlock new slot rocket
		this._rocket_slots_num_unlock=5;//so luong rocket slot duoc unlock moi 1 lan dat level yeu cau
		this._get_increase_rocket_slot_level_require=(_current_slot_num,_current_ship_level)=>{//ship level yeu cau de co the add rocket slot
			if(_current_slot_num<=this._init_rocket_slot)
				return 1;//tai level 1
			
			let _surplus_num=_current_slot_num-this._init_rocket_slot;
			let _increasing_turn_num;//so' lan` increase da(hoac co the) thuc hien
			    _increasing_turn_num=Math.floor(_surplus_num/this._rocket_slots_num_unlock);
				
			return this._levels_required_to_add_rocket_slots[_increasing_turn_num];
		};
		
		this._mission_1_bonus=this._standard_price*250;
		this._mission_2_bonus=this._standard_price*250;
		this._mission_2_sub_bonus=this._mission_2_bonus/20;//chơi lại 1 level mà đã vượt qua rồi
		this._mission_3_bonus=this._standard_price*250;
		
		this._mission_2_lucky_wheel_turn_num_reward=[1,3,5];//so' turn nhan duoc tuong ung' voi' so' sao tu 1->3
		
		this._light_shield_delay=60;//delay cua la' chan' bao ve
		
		this._space_tunnel_game_dark_energy_bonus=2;//phan thuong sau khi pass level
		
		this._space_tunnel_game_bonus=this._standard_price*70;//so tien nhan duoc khi hoan thanh level
		this._space_tunnel_game_bonus_rate=0.05;//tang len theo level
		//this._space_tunnel_game_kill_bonus=this._standard_price;//số tiền nhận đươc khi tiêu diệt 1 enemy-unit tại level thấp nhất
		this._space_tunnel_game_kill_bonus_rate=0.05;//số tiền nhận được tăng theo game -level
		
		this._defense_game_dark_matter_bonus=2;//phan thuong sau khi pass level
		
		this._assault_mode_bonus_min=this._standard_price*150;//level 1
		this._assault_mode_bonus_rate=0.05;//tang len theo level
		this._defense_mode_bonus_min=this._standard_price*150;
		this._defense_mode_bonus_rate=0.05;//tang len theo level
		this._defense_mode_kill_bonus=parseInt(this._standard_price/2);//so tien nhan duoc khi tieu diet 1 unit
		this._defense_mode_kill_bonus_rate=0.05;//tang len theo level
		
		this._legion_game_max_level=200;//Level cao nhat trong PvsC mode
		
		this._max_mother_ship_in_type=5;//so ship toi' da trong cung 1 loai(legion-game)
		
		//**VD: ID cua MotherHeatingShip1=100000, MotherHeatingShip2=100001,...
		//		ID cua MotherFreezingShip1=200000, MotherFreezingShip2=200001,...
		//			   MotherRocketShip1=300000,...
		this._mother_ship_first_id=100000;//(legion-game), id cua mother-ship dau tien.
		
		this._standard_unit_num_in_group=200;//su dung de tinh' so luong child-ship hien? thi, lay total-num/standard-num=child-num
		this._standard_rocket_speed=100;
		this._standard_size=1;
		
		this._init_mother_ship_num_in_type=2;//số mother-ship(trong cùng 1 loại) có được lúc chơi game lần đầu
		
		this._first_login_mother_heating_ship_num=this._init_mother_ship_num_in_type;//lân đầu đăng nhạp được tặng sẵn 1 số lượng ship
		this._first_login_mother_freezing_ship_num=this._init_mother_ship_num_in_type;
		this._first_login_mother_rocket_ship_num=this._init_mother_ship_num_in_type;
		this._first_login_laser_ship_num=120000;
		this._first_login_rocket_ship_num=120000;
		this._first_login_flash_ship_num=120000;
		this._first_login_rocket1_num=this._init_rocket_slot;//chi ap dung cho space ship 1
		this._first_login_rocket2_num=0;
		this._first_login_rocket3_num=0;
		this._first_login_warehouse_rocket1_num=500;
		this._first_login_warehouse_rocket2_num=0;
		this._first_login_warehouse_rocket3_num=0;
		
		this._first_login_lucky_wheel_turns_num=0;//so luot vong quay may man
		this._first_login_green_infinity_stone_num=0;
		this._first_login_purple_infinity_stone_num=0;
		this._first_login_blue_infinity_stone_num=0;
		this._first_login_red_infinity_stone_num=0;
		this._first_login_yellow_infinity_stone_num=0;
		this._first_login_dark_matter_num=0;
		this._first_login_dark_energy_num=0;
		
		this._mother_ship_type_list=[
			["mother-heating-ship","Mother Heating Ship"],//co them thong tin tuy y mien sao ko thay doi thu tu
			["mother-freezing-ship","Mother Freezing Ship"],
			["mother-rocket-ship","Mother Rocket Ship"]
		];
		this._mother_ship_type_num=this._mother_ship_type_list.length;//type of mother ship
		
		
		
		this._plasmagun_1_default_dam=this._standard_hp/20;//damage tai level 1
		this._plasmagun_1_add_dam_rate=this._plasmagun_1_default_dam/6;//damage tang len thi len 1 level
		this._plasmagun_1_default_fire_delay=0.5;//toc do ban tai level 1
		this._plasmagun_1_add_fire_rate=0.03;//toc do ban tang len khi len 1 level
		this._lasergun_1_default_dam=this._standard_hp/20;
		this._lasergun_1_add_dam_rate=this._plasmagun_1_default_dam/7;
		this._lasergun_1_default_fire_delay=0.6;
		this._lasergun_1_add_fire_rate=0.02;
		
		this._rocketgun_1_default_dam=this._standard_hp/20;
		this._rocketgun_1_add_dam_rate=this._plasmagun_1_default_dam/7;
		this._rocketgun_1_default_fire_delay=0.7;
		this._rocketgun_1_add_fire_rate=0.01;
		
		/*
			+upgrade_cost là chi phí để nâng cấp từ level 1 lên level 2
			+upgrade_cost_multiple là cấp số nhân để tính chi phí nâng cấp từ level 3 trở nên
				VD: -chi phí nâng cấp từ level 2 lên level 3 sẽ là upgrade_cost*upgrade_cost_multiple
					-chi phí nâng cấp từ level 3 lên level 4 sẽ là upgrade_cost*upgrade_cost_multiple*2
					...
		*/
		this._auxiliary_infors=[
			{id:1,name:"laser1",create_fc:(_unit,_pos,_level)=>{_unit.add_laser_gun_1(_pos,_level);},
				price:this._standard_price*500,
				img:"./resources/icons/child-ship-4.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:6,model_id:"lasergun-1",icon_rotate:false},
			{id:2,name:"laser2",create_fc:(_unit,_pos,_level)=>{_unit.add_laser_gun_2(_pos,_level);},
				price:this._standard_price*500,
				img:"./resources/icons/child-ship-4.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:7,model_id:"lasergun-1",icon_rotate:true},
			
			//{id:3,name:"laser2",create_fc:(_unit,_pos,_level)=>{_unit.add_laser_gun_3(_pos,_level);},price:this._standard_price*1000,
			//img:"./resources/icons/spaceship-icon-2.png",upgrade_cost:10,upgrade_cost_multiple:2,ship_level:1},
			
			{id:4,name:"plasma1",create_fc:(_unit,_pos,_level)=>{_unit.add_plasma_gun_1(_pos,_level);},
				price:this._standard_price*1000,
				img:"./resources/icons/child-ship-2.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:9,model_id:"plasmagun-1",icon_rotate:false},
			{id:5,name:"plasma2",create_fc:(_unit,_pos,_level)=>{_unit.add_plasma_gun_2(_pos,_level);},
				price:this._standard_price*1000,
				img:"./resources/icons/child-ship-2.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:11,model_id:"plasmagun-1",icon_rotate:true},
			/*
			{id:6,name:"rocket1",create_fc:(_unit,_pos,_level)=>{_unit.add_rocket_gun_1(_pos,_level);},
				price:this._standard_price*1500,
				img:"./resources/icons/child-ship-5.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:13,model_id:"rocketgun-1",icon_rotate:false},
			{id:7,name:"rocket2",create_fc:(_unit,_pos,_level)=>{_unit.add_rocket_gun_2(_pos,_level);},
				price:this._standard_price*1500,
				img:"./resources/icons/child-ship-5.png",upgrade_cost:10,upgrade_cost_multiple:2,
				ship_level:15,model_id:"rocketgun-1",icon_rotate:true}
				*/
		];
		this.spaceship_auxiliary_max_level=10;//level cao nhat cua child ship
		this.spaceship_auxiliary_upgrade_item_require_id=1001;//id cua item su dung de nang cap
		//this.spaceship_auxiliary_upgrade_arithmetic_progression=5;//cap so cong
		this.spaceship_auxiliary_right_wing_extra_level=5;//level require: rightLevel=leftLevel+extra
		
		this.spaceship_main_skill_level_rate=0.1;//cộng thêm 10% damage khi lên level
		/*delay nay ko ap dung co cac common-skill vd: speed-up, light-shield*/
		this.spaceship_main_skill_delay=6;//thoi gian delay cua main skill
		
		/*
			*Các skills phụ của spaceship
				-limit là số lần sử dụng
				-nếu limit=false nghĩa là ko giới hạn số lần
				-permanent_ownership=true -> so huu vinh vien
				-using_combat_mode-> su dung cho computer trong che do combat
		*/
		this.spaceship_additional_skills=[
			{id:1,group:1,name:"add-skill-rocket-1",icon:"./resources/icons/skills/20.png",icon_label:"",limit:false,
				ship_level:1,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_simple_rocket(_unit,2,_level);},skill_upgrade_cost_min:10,
				description:"Project the energy field twice forward",
				using_combat_mode:true},
			
			
			{id:1001,group:2,name:"add-skill-invisible",icon:"./resources/icons/skills/21.png",icon_label:"",limit:false,
				ship_level:12,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_invisible(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Invisible from enemy sight",
				using_combat_mode:false},
			{id:1002,group:2,name:"add-skill-strengthen-default-weapon-1",icon:"./resources/icons/skills/13.png",icon_label:"",limit:false,
				ship_level:14,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_strengthen_default_weapon_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Enhance default laser weapon",
				using_combat_mode:false},
			{id:1003,group:2,name:"add-skill-strengthen-rocket-damage-1",icon:"./resources/icons/skills/11.png",icon_label:"",limit:false,
				ship_level:16,price:this._standard_price*1200,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_strengthen_rocket_damage_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Enhance the destructive power of rockets",
				using_combat_mode:false},
			
			
			/*ship-level can thiet de mua skill dau tien trong cac group duoi day nen >1 de khi player moi choi game
			 va chi so huu 1 ship se ko su dung duoc cac skill trong group khac ngay ma phai choi game 1 thoi gian*/
			{id:2001,group:3,name:"add-skill-generate-photon-1",icon:"./resources/icons/skills/12.png",icon_label:"",limit:false,
				ship_level:3,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_photon_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires high-energy photon beams forward for a few seconds",
				using_combat_mode:true},
			{id:2002,group:3,name:"add-skill-generate-photon-2",icon:"./resources/icons/skills/skill-icon-3.png",icon_label:"",limit:false,
				ship_level:14,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_photon_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires multiple high-energy photon beams at enemies for several seconds"},
			{id:2003,group:3,name:"add-skill-generate-multi-photon-1",icon:"./resources/icons/skills/5.png",icon_label:"",limit:false,
				ship_level:9,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_multi_photon_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch a series of high-energy photon beams forward",
				using_combat_mode:true},
			{id:2004,group:3,name:"add-skill-generate-multi-photon-2",icon:"./resources/icons/skills/1.png",icon_label:"",limit:false,
				ship_level:13,price:this._standard_price*1200,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_multi_photon_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Emits 10 photons in 10 directions",
				using_combat_mode:true},
			//{id:2005,group:3,name:"add-skill-generate-multi-photon-3",icon:"./resources/icons/skills/16.png",icon_label:"",limit:false,
				//ship_level:15,price:this._standard_price*2000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_multi_photon_3(_unit,_level);},skill_upgrade_cost_min:10,description:"Phóng tia photon hình chữ X"},
			{id:2006,group:3,name:"add-skill-generate-multi-photon-4",icon:"./resources/icons/skills/yellow-photon.png",icon_label:"",limit:false,
				ship_level:8,price:this._standard_price*2000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_generate_multi_photon_4(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires multiple beams of photons that have very high temperatures and can be directed towards the enemy.",
				using_combat_mode:true},
			
			{id:3001,group:4,name:"add-skill-ice-storm-1",icon:"./resources/icons/skills/skill-icon-1.png",icon_label:"",limit:false,
				ship_level:6,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_energy_storm_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires multiple high intensity energy beams forward",
				using_combat_mode:true},
			{id:3002,group:4,name:"add-skill-ice-storm-2",icon:"./resources/icons/skills/skill-icon-2.png",icon_label:"",limit:false,
				ship_level:7,price:this._standard_price*800,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_ice_storm_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch a beam of super-cold energy forward",
				using_combat_mode:true},
			{id:3003,group:4,name:"add-skill-cyclone-1",icon:"./resources/icons/skills/22.png",icon_label:"",limit:false,
				ship_level:8,price:this._standard_price*900,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_cyclone_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Emits multiple beams of radiation forward, at positions where the beams resonate with each other, causing massive damage to enemies.",
				using_combat_mode:true},
			{id:3004,group:4,name:"add-skill-spinning-1",icon:"./resources/icons/skills/10.png",icon_label:"",limit:false,
				ship_level:10,price:this._standard_price*900,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_spinning_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Creates a magnetic field around the ship that damages enemies that come near and reduces damage taken by enemies.",
				using_combat_mode:false},
			{id:3005,group:4,name:"add-skill-spinning-2",icon:"./resources/icons/skills/14.png",icon_label:"",limit:false,
				ship_level:11,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_spinning_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires out two super cold energy fields that revolve around the ship, damaging and slowing nearby enemies.",
				using_combat_mode:true},
			{id:3006,group:4,name:"add-skill-spinning-3",icon:"./resources/icons/skills/15.png",icon_label:"",limit:false,
				ship_level:17,price:this._standard_price*1200,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_spinning_3(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fires out two super-heated energy fields that orbit the ship, damaging and weakening enemies.",
				using_combat_mode:true},
			{id:3007,group:4,name:"add-skill-spinning-4",icon:"./resources/icons/skills/18.png",icon_label:"",limit:false,
				ship_level:18,price:this._standard_price*1500,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_spinning_4(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Emits a super hot energy stream and a super cold energy stream that rotates around to destroy and reduce the speed and damage of enemies.",
				using_combat_mode:true},
			
			
			{id:4001,group:5,name:"add-skill-heat-rocket-1",icon:"./resources/icons/skills/3.png",icon_label:"",limit:false,
				ship_level:5,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_heat_rocket_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"launch rockets forward.",
				using_combat_mode:true},
			{id:4002,group:5,name:"add-skill-heat-rocket-2",icon:"./resources/icons/skills/skill-icon-4.png",icon_label:"",limit:false,
				ship_level:7,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_heat_rocket_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"launch a series of missiles forward in a continuous flight in the direction of the ship",
				using_combat_mode:true},
			{id:4003,group:5,name:"add-skill-freeze-rocket-1",icon:"./resources/icons/skills/4.png",icon_label:"",limit:false,
				ship_level:9,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_freeze_rocket_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch a series of supersonic missiles forward continuously flying in the direction of the ship",
				using_combat_mode:true},
			{id:4004,group:5,name:"add-skill-multi-rocket-1",icon:"./resources/icons/skills/8.png",icon_label:"",limit:false,
				ship_level:7,price:this._standard_price*1200,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_multi_rocket_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Fire a shower of rockets forward",
				using_combat_mode:true},
			{id:4005,group:5,name:"add-skill-multi-rocket-2",icon:"./resources/icons/skills/2.png",icon_label:"",limit:false,
				ship_level:9,price:this._standard_price*1500,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_multi_rocket_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch many rockets in all directions forming a circle",
				using_combat_mode:true},
			{id:4006,group:5,name:"add-skill-multi-rocket-3",icon:"./resources/icons/skills/9.png",icon_label:"",limit:false,
				ship_level:8,price:this._standard_price*2000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_multi_rocket_3(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch a series of rockets",
				using_combat_mode:true},
			
			
			{id:5001,group:6,name:"add-skill-time-rocket-1",icon:"./resources/icons/skills/23.png",icon_label:"1",limit:false,
				ship_level:8,price:this._standard_price*700,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_time_rocket_1(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launches a slow-exploding rocket forward, acting like a time-delayed bomb, exploding after a period of time.",
				using_combat_mode:false},
			{id:5002,group:6,name:"add-skill-time-rocket-2",icon:"./resources/icons/skills/23.png",icon_label:"2",limit:false,
				ship_level:13,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_time_rocket_2(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launch multiple slow-burning rockets",
				using_combat_mode:false},
			{id:5003,group:6,name:"add-skill-time-rocket-3",icon:"./resources/icons/skills/23.png",icon_label:"3",limit:false,
				ship_level:17,price:this._standard_price*1200,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_time_rocket_3(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launches a slow-exploding rocket that will explode after a period of time or you can trigger it by pressing the button.",
				using_combat_mode:false},
			{id:5004,group:6,name:"add-skill-time-rocket-4",icon:"./resources/icons/skills/23.png",icon_label:"4",limit:false,
				ship_level:20,price:this._standard_price*1500,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_time_rocket_4(_unit,_level);},skill_upgrade_cost_min:10,
				description:"Launches a slow-burning rocket that only explodes when the trigger is pressed.",
				using_combat_mode:false},
			
			//{id:2,name:"add-skill-rocket-2",icon:"./resources/icons/add-skill-2.png",limit:false,ship_level:1,price:this._standard_price*150,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_simple_rocket(_unit,3,_level);},skill_upgrade_cost_min:10},
			//{id:3,name:"add-skill-rocket-3",icon:"./resources/icons/add-skill-3.png",limit:false,ship_level:1,price:this._standard_price*250,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_simple_rocket(_unit,4,_level);},skill_upgrade_cost_min:10},
			//{id:4,name:"add-skill-rocket-4",icon:"./resources/icons/add-skill-4.png",limit:false,ship_level:1,price:this._standard_price*350,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_additional_skill_simple_rocket(_unit,5,_level);},skill_upgrade_cost_min:10},
			//{id:5,name:"add-skill-rocket-5",limit:false,ship_level:5,price:45000,img:"",create_fc:(_unit)=>{_unit.apply_additional_skill_simple_rocket(_unit,6);}},
			//{id:6,name:"add-skill-rocket-6",limit:false,ship_level:6,price:55000,img:"",create_fc:(_unit)=>{_unit.apply_additional_skill_simple_rocket(_unit,7);}},
			//{id:3,name:"add-skill-hp-refill-1",limit:3,ship_level:1,price:7000,img:"",create_fc:(_unit)=>{_unit.apply_additional_skill_rocket_1(_unit);}},
			//{id:4,name:"add-skill-hp-refill-2",limit:3,ship_level:3,price:7000,img:"",create_fc:(_unit)=>{_unit.apply_additional_skill_rocket_1(_unit);}},
		];
		this.spaceship_additional_skills_level_rate=0.2;//cộng thêm 20% damage khi lên level
		this.spaceship_additional_skills_upgrade_item_require_id=2001;//id cua item su dung de nang cap
		this.spaceship_additional_skills_upgrade_arithmetic_progression=5;//cap so cong
		
		
		this.spaceship_passive_skills=[
			
			{id:1,name:"passive-skill-multi-rocket-1",icon:"./resources/icons/add-skill-2.png",icon_label:"1",limit:false,
				ship_level:1,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_1(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn về phía trước"},
			{id:2,name:"passive-skill-multi-rocket-2",icon:"./resources/icons/add-skill-2.png",icon_label:"2",limit:false,
				ship_level:4,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_2(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn về phía sau"},
			{id:3,name:"passive-skill-multi-rocket-3",icon:"./resources/icons/add-skill-2.png",icon_label:"3",limit:false,
				ship_level:8,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_3(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn về phía bên trái"},
			{id:4,name:"passive-skill-multi-rocket-4",icon:"./resources/icons/add-skill-2.png",icon_label:"4",limit:false,
				ship_level:12,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_4(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn về phía bên phải"},
			{id:5,name:"passive-skill-multi-rocket-5",icon:"./resources/icons/add-skill-2.png",icon_label:"5",limit:false,
				ship_level:16,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_5(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn xuống phía dưới"},
			{id:6,name:"passive-skill-multi-rocket-6",icon:"./resources/icons/add-skill-2.png",icon_label:"6",limit:false,
				ship_level:20,price:this._standard_price*500,permanent_ownership:false,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_multi_rocket_6(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng loạt hỏa tiễn hướng lên trên"},
			
			{id:7,name:"passive-skill-circle-rocket-1",icon:"./resources/icons/add-skill-1.png",icon_label:"",limit:false,
				ship_level:24,price:this._standard_price*1000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_circling_rocket(_unit,_level);},skill_upgrade_cost_min:10,description:"phóng hỏa tiễn xoay vòng tròn xung quanh tàu của bạn"},
			
			{id:8,name:"passive-skill-self-healing-1",icon:"./resources/icons/skills/6.png",icon_label:"",limit:false,
				ship_level:30,price:this._standard_price*3000,permanent_ownership:true,create_fc:(_unit,_level)=>{_unit.apply_passive_skill_self_healing_1(_unit,1,_level);},skill_upgrade_cost_min:10,description:"tự động hồi HP"},
			
		];
		this.spaceship_passive_skills_level_rate=0.2;//cộng thêm 20% damage khi lên level
		this.spaceship_passive_skills_upgrade_item_require_id=2001;//id cua item su dung de nang cap
		this.spaceship_passive_skills_upgrade_arithmetic_progression=5;//cap so cong
		
		/*
			anti: cho biet loai giap nay co the su dung de chong' lai nhung don` danh' thuoc group nao trong 5 group
			id cua cac loai armours neu co thay doi thi phai sua lai function Take_Damage trong class unit.js
		*/
		this.spaceship_armours=[
			
			{id:1,name:"Optical reflective armor",ship_level:4,anti:null,icon:"./resources/icons/armours/5.png",label:"A1",
				min_power:0.1,
				price:this._standard_price*300,
				description:"Reduce damage from laser attacks by reflecting a portion of the beam.",
				upgrade_cost_min:5},//giam sat thuong photon
			{id:2,name:"Explosive reactive armor",ship_level:6,anti:null,icon:"./resources/icons/armours/12.png",label:"A2",
				min_power:0.1,
				price:this._standard_price*300,
				description:"Protect the ship from missile attacks by deflecting the destructive force of the warheads.",
				upgrade_cost_min:5},//giam sat thuong rocket
			{id:3,name:"Ballistic armor",ship_level:20,anti:null,icon:"./resources/icons/armours/8.png",label:"A2",
				min_power:0.1,
				price:this._standard_price*300,
				description:"This helps the ship withstand armor-piercing rounds fired from heavy weapons.",
				upgrade_cost_min:5},//giap chong' dan
			{id:4,name:"Magic resistant armor",ship_level:20,anti:null,icon:"./resources/icons/armours/7.png",label:"A2",
				min_power:0.1,
				price:this._standard_price*300,
				description:"Increase resistance to magical attacks.",
				upgrade_cost_min:5},//giam sat thuong cac don` ma thuat
			{id:5,name:"Heat resistant armor",ship_level:20,anti:null,icon:"./resources/icons/armours/10.png",label:"A2",
				min_power:0.1,
				price:this._standard_price*300,
				description:"Reduce damage to the ship when subjected to heat attacks or in high-temperature environments.",
				upgrade_cost_min:5},//giam sat thuong boi nhiet do
				/*
			{id:3,name:"",ship_level:7,anti:null,icon:"./resources/icons/armours/12.png",label:"A3",
				min_power:0.1,
				price:this._standard_price*30,
				description:"",
				upgrade_cost_min:5},//giam sat thuong cua default-weapon
			{id:4,name:"",ship_level:8,anti:1,icon:"./resources/icons/armours/8.png",label:"A4",
				min_power:0.1,
				price:this._standard_price*500,
				description:"",
				upgrade_cost_min:5},
			{id:5,name:"",ship_level:20,anti:2,icon:"./resources/icons/armours/13.png",label:"A5",
				min_power:0.1,
				price:this._standard_price*500,
				description:"",
				upgrade_cost_min:5},
			{id:6,name:"",ship_level:20,anti:3,icon:"./resources/icons/armours/4.png",label:"A6",
				min_power:0.1,
				price:this._standard_price*500,
				description:"",
				upgrade_cost_min:5},
			{id:7,name:"",ship_level:20,anti:4,icon:"./resources/icons/armours/10.png",label:"A7",
				min_power:0.1,
				price:this._standard_price*500,
				description:"",
				upgrade_cost_min:5},
			{id:8,name:"",ship_level:20,anti:5,icon:"./resources/icons/armours/7.png",label:"A8",
				min_power:0.1,
				price:this._standard_price*500,
				description:"",
				upgrade_cost_min:5},
				*/
		];
		this.getArmourIDThatDefend=(_defend_group_id)=>{//lay' id cua loai armour ma anti group_id nhap vao
			for(let i=0;i<this.spaceship_armours.length;i++){
				if(this.spaceship_armours[i].anti===_defend_group_id)
					return this.spaceship_armours[i].id;
			}
			return null;
		};
		this.getArmourInfor=(_id)=>{
			for(let i=0;i<this.spaceship_armours.length;i++){
				if(this.spaceship_armours[i].id===_id)
					return this.spaceship_armours[i];
			}
			return null;
		};
		this.getArmourPower=(_id,_level)=>{// tin'h ra kha nang giam? sat thuong cua cac loai armour dua tren level
			let _min_power=this.getArmourInfor(_id).min_power;
			let _rs=_min_power+(_level*0.02);//tang 2% theo moi level
			if(_rs>1)_rs=1;
			
			return _rs;//ko dc parseInt hay lam tron`
		};
		this.spaceship_armour_upgrade_item_require_id=2001;//id cua item su dung de nang cap
		this.spaceship_armour_upgrade_arithmetic_progression=5;//cap so cong
		/*
			ship_level_max:vuot qua level nay thi ship ko duoc su dung item increate exp
		*/
		this.spaceship_items=[
			{id:1,name:"",player_level:3,ship_level:1,ship_level_max:3,price:this._standard_price*1400,value:2500,icon_path:"./resources/icons/upgrade-1.png",label:"2500EXP",description:"Increase 2500 exp"},
			{id:2,name:"",player_level:4,ship_level:1,ship_level_max:5,price:this._standard_price*2400,value:5000,icon_path:"./resources/icons/upgrade-1.png",label:"5000EXP",description:"Increase 5000 exp"},
			{id:3,name:"",player_level:5,ship_level:1,ship_level_max:8,price:this._standard_price*4000,value:10000,icon_path:"./resources/icons/upgrade-1.png",label:"10000EXP",description:"Increase 10000 exp"},
			{id:4,name:"",player_level:8,ship_level:1,ship_level_max:12,price:this._standard_price*10000,value:20000,icon_path:"./resources/icons/upgrade-1.png",label:"20000EXP",description:"Increase 20000 exp"},
		];
	}
	
	
	init_test_mode_1(){//su dung khi test game
		return;
			if(localStorage.getItem('showroom-unlock-all')==="true"){
				for(let i=0;i<this.spaceship_items.length;i++){
					//this.spaceship_items[i].player_level=1;
					//this.spaceship_items[i].ship_level_max=1000;
				}
			}
			let _bttn=document.createElement("button");
				_bttn.style.position="absolute";
				_bttn.style.top="100px";
				_bttn.style.left="30px";
				_bttn.innerHTML="Unlock All";
				document.body.appendChild(_bttn);
				_bttn.addEventListener("click",()=>{
					try{
						localStorage.setItem('showroom-unlock-all', "true");
						if(this._game._me){
							this._game._me._ship_package.set_ship_level(100);
							this._game._me.apply_space_ship_level_package();
						}
						this._game._root_inventory.AddCash(9999999999);
						this._game._warehouse.add_player_ship(2);
						this._game._warehouse.add_player_ship(3);
						this._game._warehouse.add_player_ship(4);
						this._game._warehouse.add_player_ship(5);
						this._game.get_player_level=()=>{
							return 100;
						};
						this._game._item_package.add_item(1001,1000);
						this._game._item_package.add_item(2001,1000);
						this._game._item_package.add_item(1,1000);
						this._game._item_package.add_item(2,1000);
						this._game._item_package.add_item(3,1000);
						this._game._item_package.add_item(4,1000);
						this._game._item_package.add_item(5,1000);
						
						window.location.reload();
					}
					catch(e){
						alert(e.stack);
					}
				});
		/*
			nhap game-level muon choi vao day
			-voi game space-tunnel se tu dong choi game-level da Nhap
			-voi dead-universe chi can nhap bat ky cai gi cung se kich hoat che do tu do lua chon level
		*/
		let _input=document.createElement("input");
			_input.type="input";
			_input.style.position="absolute";
			_input.style.top="150px";
			_input.style.left="30px";
			_input.style.width="100px";
			_input.style.height="40px";
			document.body.appendChild(_input);	

			localStorage.setItem('demo-game-level',null);	
			_input.addEventListener("keyup",()=>{
				localStorage.setItem('demo-game-level',_input.value);	
				//alert(_input.value);
			});
		
		let _unlock_ship=document.createElement("button");
		_unlock_ship.style.position="absolute";
		_unlock_ship.style.top="200px";
		_unlock_ship.style.left="30px";
		_unlock_ship.innerHTML="Unlock Ships";
		document.body.appendChild(_unlock_ship);
		_unlock_ship.addEventListener("click",()=>{
					    this._game._warehouse.add_player_ship(2);
						this._game._warehouse.add_player_ship(3);
						this._game._warehouse.add_player_ship(4);
						this._game._warehouse.add_player_ship(5);
						
						window.location.reload();
		});
		
		let _add_cash_btn=document.createElement("button");
		_add_cash_btn.style.position="absolute";
		_add_cash_btn.style.top="250px";
		_add_cash_btn.style.left="30px";
		_add_cash_btn.innerHTML="Add 100.000$";
		document.body.appendChild(_add_cash_btn);
		_add_cash_btn.addEventListener("click",()=>{
			this._game._root_inventory.AddCash(100000);
		});
		
		let _add_exp_btn=document.createElement("button");
		_add_exp_btn.style.position="absolute";
		_add_exp_btn.style.top="300px";
		_add_exp_btn.style.left="30px";
		_add_exp_btn.innerHTML="Add 1000Exp";
		document.body.appendChild(_add_exp_btn);
		_add_exp_btn.addEventListener("click",()=>{
			this._game._show_room._ship_package.plus_ship_exp(1000);
			this._game._show_room._ship_package.save_data();
			this._game._show_room._ship_package.upgrade_level();
			this._game._show_room.update_data();
		});
		
		let _add_exp_btn_2=document.createElement("button");
		_add_exp_btn_2.style.position="absolute";
		_add_exp_btn_2.style.top="300px";
		_add_exp_btn_2.style.left="160px";
		_add_exp_btn_2.innerHTML="Add 10000Exp";
		document.body.appendChild(_add_exp_btn_2);
		_add_exp_btn_2.addEventListener("click",()=>{
			this._game._show_room._ship_package.plus_ship_exp(10000);
			this._game._show_room._ship_package.save_data();
			this._game._show_room._ship_package.upgrade_level();
			this._game._show_room.update_data();
		});
		
		let _upgrade_main_skill_btn=document.createElement("button");
		_upgrade_main_skill_btn.style.position="absolute";
		_upgrade_main_skill_btn.style.top="350px";
		_upgrade_main_skill_btn.style.left="30px";
		_upgrade_main_skill_btn.innerHTML="Upgrade Main Skill";
		document.body.appendChild(_upgrade_main_skill_btn);
		_upgrade_main_skill_btn.addEventListener("click",()=>{
			this._game._show_room._ship_package.upgrade_main_skill_level(0);
			this._game._show_room._ship_package.upgrade_main_skill_level(1);
			this._game._show_room._ship_package.upgrade_main_skill_level(2);
			this._game._show_room._ship_package.upgrade_main_skill_level(3);
			this._game._show_room._ship_package.upgrade_main_skill_level(4);
			this._game._show_room._ship_package.upgrade_main_skill_level(5);
			this._game._show_room._ship_package.save_data();
			//this._game._show_room.update_data();
		});
		
		
		let _add_dark_energy_btn=document.createElement("button");
		_add_dark_energy_btn.style.position="absolute";
		_add_dark_energy_btn.style.top="400px";
		_add_dark_energy_btn.style.left="30px";
		_add_dark_energy_btn.innerHTML="Add 10 DarkEnergy";
		document.body.appendChild(_add_dark_energy_btn);
		_add_dark_energy_btn.addEventListener("click",()=>{
			//this._game._item_package.add_item(1001,10);
			this._game._item_package.add_item(2001,10);
		});
		
		let _add_dark_matter_btn=document.createElement("button");
		_add_dark_matter_btn.style.position="absolute";
		_add_dark_matter_btn.style.top="450px";
		_add_dark_matter_btn.style.left="30px";
		_add_dark_matter_btn.innerHTML="Add 10 DarkMatter";
		document.body.appendChild(_add_dark_matter_btn);
		_add_dark_matter_btn.addEventListener("click",()=>{
			this._game._item_package.add_item(1001,10);
			//this._game._item_package.add_item(2001,10);
		});
		
		
		
		let _add_rocket_slot_btn=document.createElement("button");
		_add_rocket_slot_btn.style.position="absolute";
		_add_rocket_slot_btn.style.top="500px";
		_add_rocket_slot_btn.style.left="30px";
		_add_rocket_slot_btn.innerHTML="Add Rocket Slot";
		document.body.appendChild(_add_rocket_slot_btn);
		_add_rocket_slot_btn.addEventListener("click",()=>{
			this._game._show_room._ship_package.increase_max_rocket_num();
		});
		
		let _add_rocket_slot_btn2=document.createElement("button");
		_add_rocket_slot_btn2.style.position="absolute";
		_add_rocket_slot_btn2.style.top="550px";
		_add_rocket_slot_btn2.style.left="30px";
		_add_rocket_slot_btn2.innerHTML="Add 10 Rocket Slot";
		document.body.appendChild(_add_rocket_slot_btn2);
		_add_rocket_slot_btn2.addEventListener("click",()=>{
			for(let i=0;i<10;i++)
				this._game._show_room._ship_package.increase_max_rocket_num();
		});
		
		let _add_rocket_slot_btn3=document.createElement("button");
		_add_rocket_slot_btn3.style.position="absolute";
		_add_rocket_slot_btn3.style.top="600px";
		_add_rocket_slot_btn3.style.left="30px";
		_add_rocket_slot_btn3.innerHTML="Add 20 Rocket Slot";
		document.body.appendChild(_add_rocket_slot_btn3);
		_add_rocket_slot_btn3.addEventListener("click",()=>{
			for(let i=0;i<20;i++)
				this._game._show_room._ship_package.increase_max_rocket_num();
		});
	}
	//--------------ARMOURS----------------------------
	get_armours_ids(){
		let _ids=new Array();
		for(let i=0;i<this.spaceship_armours.length;i++){
			_ids.push(this.spaceship_armours[i].id);
		}
		return _ids;
	}
	get_armours_infor(_id){
		for(let i=0;i<this.spaceship_armours.length;i++){
			if(this.spaceship_armours[i].id===_id)
				return this.spaceship_armours[i];
		}
		return null;
	}
	get_armour_name(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.name;
	}
	get_armour_icon_path(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.icon;
	}
	get_armour_label(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.label;
	}
	get_armour_ship_level_require(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.ship_level;
	}
	get_armour_price(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.price;
	}
	get_armour_description(_id){
		const _infor=this.get_armours_infor(_id);
		return _infor.description;
	}
	get_armour_upgrade_item_num_require(_id,_current_level){
		const _infor=this.get_armours_infor(_id);
		let _num=_infor.upgrade_cost_min;
		for(let i=2;i<_current_level+1;i++){
			_num+=this.spaceship_armour_upgrade_arithmetic_progression;
		}
		return _num;
	};
	//------------ITEMS-------------------------
	get_items_ids(){
		let _ids=new Array();
		for(let i=0;i<this.spaceship_items.length;i++){
			_ids.push(this.spaceship_items[i].id);
		}
		return _ids;
	}
	get_items_infor(_id){
		for(let i=0;i<this.spaceship_items.length;i++){
			if(this.spaceship_items[i].id===_id)
				return this.spaceship_items[i];
		}
		return null;
	}
	get_item_name(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.name;
	}
	get_item_icon_path(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.icon_path;
	}
	get_item_label(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.label;
	}
	get_item_ship_level_require(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.ship_level;
	}
	get_item_ship_level_max(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.ship_level_max;
	}
	get_item_player_level_require(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.player_level;
	}
	get_item_price(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.price;
	}
	get_item_value(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.value;
	}
	get_item_description(_id){
		const _infor=this.get_items_infor(_id);
		return _infor.description;
	}
	//----------PASSIVE SKILLS--------------------------
	get_passive_skills_ids(){
		let _ids=new Array();
		for(let i=0;i<this.spaceship_passive_skills.length;i++){
			_ids.push(this.spaceship_passive_skills[i].id);
		}
		return _ids;
	}
	get_passive_skill_infor(_id){
		for(let i=0;i<this.spaceship_passive_skills.length;i++){
			if(this.spaceship_passive_skills[i].id===_id)
				return this.spaceship_passive_skills[i];
		}
		return null;
	}
	is_passive_skill_permanent_own(_id){//kiem tra xem co so huu vinh vien ko
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.permanent_ownership;
	}
	get_passive_skill_icon_path(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.icon;
	}
	get_passive_skill_icon_label(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.icon_label;
	}
	get_passive_skill_create_fc(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.create_fc;
	}
	get_passive_skill_name(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.name;
	}
	get_passive_skill_price(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.price;
	}
	get_passive_skill_description(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.description;
	}
	get_passive_skill_limit(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.limit;
	}
	get_passive_skill_ship_level_require(_id){
		const _infor=this.get_passive_skill_infor(_id);
		return _infor.ship_level;
	}
	get_passive_skill_upgrade_item_num_require(_id,_current_level){
		const _infor=this.get_passive_skill_infor(_id);
		let _num=_infor.skill_upgrade_cost_min;
		for(let i=2;i<_current_level+1;i++){
			_num+=this.spaceship_passive_skills_upgrade_arithmetic_progression;
		}
		return _num;
	};
	//----------END PASSIVE SKILLS-------------------------
	
	
	get_additional_skills_ids(){
		let _ids=new Array();
		for(let i=0;i<this.spaceship_additional_skills.length;i++){
			_ids.push(this.spaceship_additional_skills[i].id);
		}
		return _ids;
	}
	get_additional_skill_infor(_id){
		for(let i=0;i<this.spaceship_additional_skills.length;i++){
			if(this.spaceship_additional_skills[i].id===_id)
				return this.spaceship_additional_skills[i];
		}
		return null;
	}
	get_spaceship_additional_skill_upgrade_item_num_require(_id,_current_level){
		const _infor=this.get_additional_skill_infor(_id);
		let _num=_infor.skill_upgrade_cost_min;
		for(let i=2;i<_current_level+1;i++){
			_num+=this.spaceship_additional_skills_upgrade_arithmetic_progression;
		}
		return _num;
	};
	is_additional_skill_permanent_own(_id){//kiem tra xem co so huu vinh vien ko
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.permanent_ownership;
	}
	is_additional_skill_use_for_computer_in_combat_mode(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.using_combat_mode;
	}
	get_additional_skill_group(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.group;
	}
	get_additional_skills_icon_label(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.icon_label;
	}
	get_additional_skill_description(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.description;
	}
	get_additional_skill_icon_path(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.icon;
	}
	get_additional_skill_create_fc(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.create_fc;
	}
	get_additional_skill_name(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.name;
	}
	get_additional_skill_price(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.price;
	}
	/*
	get_additional_skill_img_path(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.img;
	}
	*/
	get_additional_skill_limit(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.limit;
	}
	get_additional_skill_ship_level_require(_id){
		const _infor=this.get_additional_skill_infor(_id);
		return _infor.ship_level;
	}
	get_auxiliary_model_id(_id){
		const _infor=this.get_auxiliary_infor(_id);
		return _infor.model_id;
	}
	get_auxiliary_upgrade_cost(_id,_current_level){
		const _infor=this.get_auxiliary_infor(_id);
		if(_current_level===1)return _infor.upgrade_cost;
		
		return parseInt(_infor.upgrade_cost*_infor.upgrade_cost_multiple*(_current_level-1));
	}
	get_auxiliary_ship_level_require(_id){
		const _infor=this.get_auxiliary_infor(_id);
		return _infor.ship_level;
	}
	get_auxiliary_price(_id){
		const _infor=this.get_auxiliary_infor(_id);
		return _infor.price;
	}
	get_auxiliary_create_fc(_id){
		const _infor=this.get_auxiliary_infor(_id);
		return _infor.create_fc;
	}
	get_auxiliary_infor(_id){
		for(let i=0;i<this._auxiliary_infors.length;i++){
			if(this._auxiliary_infors[i].id===_id)
				return this._auxiliary_infors[i];
		}
		return null;
	}
	
	//VD: type_id=0 and array_id=1 => ship id=100001
	get_mother_ship_id_in_type(type_id,array_id){
		let _first_id=(type_id+1)*this._mother_ship_first_id;
		return _first_id+array_id;
	}
	get_mother_ship_array_id(ship_id){//lay' array-id dua vao ship-id
		const _type=this.get_mother_ship_type_id_by_ship_id(ship_id);
		let _rs= ship_id-((_type+1)*this._mother_ship_first_id);
		_rs+=_type*this._max_mother_ship_in_type;
		return _rs;
	}
	/*
		-Sử dụng trong legion-game để convert danh sách ship-types của computer lấy
		từ legion-game-level-mg.js sang ship-ids
	*/
	convert_types_list_to_ship_id_list(_types){
		const _rs=new Array();
		
		for(let i=0;i<_types.length;i++){
			const _ship_id=this.get_mother_ship_id_in_type(_types[i],0);//Lấy id đầu tien(100000,200000,..),2 ship có cùng id cũng ko ảnh hưởng gì vì đây là sử dụng cho computer unit
			_rs.push(_ship_id);
		}
		
		return _rs;
	}
	
	/*
		VD: row_id=0 va col_id=1 => ship_id=100001
			row_id=1 va col_id=2 => ship_id=200002
	*/
	get_mother_ship_id(col_id,row_id){//su dung cho show-room-2; Nhap vao cot va hang, ket qua tra ve la mother-ship_id
		return ((row_id+1)*this._mother_ship_first_id)+col_id;
	}
	get_mother_ship_type_id_by_ship_id(_ship_id){//kiem tra xem 1 mother ship thuoc loai nao(tra ve type id)
		if(_ship_id>=this._mother_ship_first_id&&_ship_id<2*this._mother_ship_first_id)
			return 0;
		if(_ship_id>=2*this._mother_ship_first_id&&_ship_id<3*this._mother_ship_first_id)
			return 1;
		if(_ship_id>=3*this._mother_ship_first_id&&_ship_id<4*this._mother_ship_first_id)
			return 2;
		
		return null;
	}
}
export {GameParameters}