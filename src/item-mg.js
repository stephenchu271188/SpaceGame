
/*Can phai doi chieu cac' array nay voi full_item_data*/
const liquid=['h2s04','hcl','mercury'];
const water=['water'];
const food=['carrot','grape','meat1','bread1'];
const solid=['gold','silver','copper','coal','diamond','gem','ruby','jade','iron'];

//const icy_planet_base_items=[];

const full_item_data = [
    { category: "liquid", items: [
        { name: "h2s04", unit_price: 10 },
        { name: "hcl", unit_price: 9 },
        { name: "mercury", unit_price: 8 }
    ]},
    { category: "water", items: [
        { name: "water", unit_price: 5 }
    ]},
    { category: "food", items: [
        { name: "carrot", unit_price: 3 },
        { name: "grape", unit_price: 6 },
        { name: "meat1", unit_price: 7 },
        { name: "bread1", unit_price: 3 }
    ]},
    { category: "solid", items: [
        { name: "gold", unit_price: 30 },
        { name: "silver", unit_price: 15 },
        { name: "copper", unit_price: 7 },
        { name: "coal", unit_price: 3 },
        { name: "diamond", unit_price: 40 },
        { name: "gem", unit_price: 35 },
        { name: "ruby", unit_price: 35 },
        { name: "jade", unit_price: 23 },
        { name: "iron", unit_price: 3 }
    ]}
];

class ItemMG{
	constructor(params){
		//alert(this.get_item_price('water','water'));
	}
	
	get_full_item_data(){
		return full_item_data;
	}
	get_all_category_name(){
		let _rs=new Array();
		for (let i = 0; i < full_item_data.length; i++) {
			const category = full_item_data[i].category;
			_rs.push(category);
		}
		return _rs;
	}
	
	
	get_item_price(_category, _name) {
        for (const itemCategory of full_item_data) {
            if (itemCategory.category === _category) {
                const item = itemCategory.items.find(item => item.name === _name);
                if (item) {
                    return item.unit_price;
                }
            }
        }
        return null;
    }

	get_empty_package(){//sau khi nhap cac items cua player-ship vao kho thi reset lai ve 0
		let _rs={};
			_rs['food']=[];//khi lưu vào cơ sở dữ liệu thì phải làm gọn lại
			_rs['liquid']=[];
			_rs['fuel']=[];
			_rs['solid']=[];
		return _rs;
	}
	
	//khi mới xuất phát
	get_default_items_for_player(){
		let _rs={};
			_rs['food']=[];//khi lưu vào cơ sở dữ liệu thì phải làm gọn lại
			_rs['liquid']=[];
			_rs['fuel']=[];
			_rs['solid']=[];
		return _rs;
	}
	
	get_default_items_for_root_inventory(){//các items mặc định của kho lưu trữ khi vào game lần đầu 
		let _rs={};
			_rs['food']=['carrot','grape','meat1','bread1'];//khi lưu vào cơ sở dữ liệu thì phải làm gọn lại
			_rs['liquid']=["mercury"];
			_rs['fuel']=[];
			_rs['solid']=["gold","gold","silver","iron","silver","silver","silver",
								"gold","gold","silver","iron","silver","silver","silver",
								"gold","gold","silver","iron","silver","silver","silver",
								"gold","gold","silver","iron","silver","silver","silver"];
		return _rs;
	}
	
	get_planet_base_random_items(planet_type){
		
		let _rs={};
		let _max=20;
		if(planet_type==='gas'){
			//_rs['liquid']=['h2s04','hcl','mercury'];
			_rs['liquid']=this.get_random_in_list(liquid,_max);
		}
		if(planet_type==='habitable'){
			_rs['liquid']=this.get_random_in_list(water,1);
			//_rs['food']=['carrot','grape','meat1','bread1'];
			_rs['food']=this.get_random_in_list(food,_max);
		}
		if(planet_type==='rock'){
			//_rs['solid']=['gold','silver','copper','coal','diamond','gem','ruby','jade','iron'];
			_rs['solid']=this.get_random_in_list(solid,_max);
		}
		if(planet_type==='icy'){
			_rs['liquid']=this.get_random_in_list(liquid,_max);
			_rs['solid']=this.get_random_in_list(solid,_max);
			
			//_rs['liquid']=['h2s04','hcl','mercury'];
			//_rs['solid']=['gold','silver','copper','coal','diamond','gem','ruby','jade','iron'];
		}
		
		return _rs;
	}
	
	get_random_in_list(list,num){
		let _rs=new Array();
		for(let i=0;i<num;i++){
			// Sinh số ngẫu nhiên từ 0 đến (độ dài mảng - 1)
			let randomIndex = Math.floor(Math.random() * list.length);
			// Lấy phần tử ngẫu nhiên từ mảng
			let randomElement = list[randomIndex];
			_rs.push(randomElement);
		}
		return _rs;
	}
}
export{ItemMG}