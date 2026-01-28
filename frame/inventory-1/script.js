"use strict";


window.onerror = function (msg, url, lineNo, columnNo, error) 
{
    alert('found error:'+msg);
    alert('found error:'+url);
    alert('found error:'+lineNo);
    //alert('found error:'+error);
    //alert(myGame.questions.current_answer1.name+'-'+myGame.questions.current_answer2.name+'-'+myGame.questions.current_answer3.name+'-'+myGame.questions.current_answer4.name);
    
};

//----------------------------------------------------
//Full Food: ['carrot','grape','meat1',bread1];
//Full Liquid: ['water','h2s04','hcl','mercury']
//FULL Fuel: ['battery','tnt']
//Full Solid: ['gold','silver','copper','coal','diamond','gem','ruby','jade','iron']
//Full Weapon:['sword1','axe1']
let player_item_list={};
player_item_list['food']=[];
player_item_list['liquid']=[];
player_item_list['fuel']=[];
player_item_list['solid']=[];
player_item_list['weapon']=[];
let current_category='food';

let store_item_list={};
store_item_list['food']=[];
store_item_list['liquid']=[];
store_item_list['fuel']=[];
store_item_list['solid']=[];
store_item_list['weapon']=[];

function set_player_item_list(_tlist){
	player_item_list=_tlist;
};
function set_station_item_list(_tlist){
	store_item_list=_tlist;
};

//---------------------------------------------------------

let space_station_store=document.getElementById("space-station-store");
let personal_inventory=document.getElementById("personal-inventory");
space_station_store.innerHTML="";
personal_inventory.innerHTML="";


function create_inventory_frame(_dom,row_num,col_num){
	
	for(let i=0;i<row_num;i++){
		let _row=document.createElement("div");
		_row.classList.add("inventory-row");
		_dom.appendChild(_row);
		for(let j=0;j<col_num;j++){
			let _cell=document.createElement("div");
			_cell.classList.add("inventory-cell");
			_row.appendChild(_cell);
			
			//_cell.innerHTML='<div class="inventory-item carrot" data-item-type="food"></div>';
			
			
		}
	}
}

function click_handle(_id,_tablename)
{
	let _element=document.getElementById(_id);
	let _category=_element.getAttribute("data-category");
	let _name=_element.getAttribute("data-name");
	
	//let _table;
	//if(_tablename==='personal')_table=personal_inventory;
	//if(_tablename==='station')_table=space_station_store;

	//alert(get_data(_table));
	if(_tablename==='personal'){
		remove_item_from_list(player_item_list,_name,_category);
		add_item_to_list(store_item_list,_name,_category);
		
		add_item_to_empty_cell(space_station_store,_name,_category);
	}
	if(_tablename==='station'){
		remove_item_from_list(store_item_list,_name,_category);
		add_item_to_list(player_item_list,_name,_category);
		
		add_item_to_empty_cell(personal_inventory,_name,_category);
	}
	_element.remove();
};

function remove_item_from_list(_list,_name,_category){
	let index = _list[_category].indexOf(_name);

	if (index !== -1) {
		_list[_category].splice(index, 1);
	}
};
function add_item_to_list(_list,_name,_category){
	_list[_category].push(_name);
};

let _next_id=0;
function get_next_id(){
	_next_id++;
	return "item-cell-"+_next_id;
};
function add_item_to_empty_cell(inventoryTable,_name,_type){
	// Lấy tất cả các ô cell trong bảng inventory
	let cells = inventoryTable.querySelectorAll('.inventory-cell');
	let _tTable;
	if(inventoryTable===personal_inventory)_tTable="personal";
	if(inventoryTable===space_station_store)_tTable="station";
	for(let i=0;i<cells.length;i++) {
		let cell=cells[i];
		if(cell.innerHTML.trim()===''){
			let _nextID=get_next_id();
			cell.innerHTML='<div onclick="click_handle(\'' + _nextID + '\', \'' + _tTable + '\')" data-category="'+_type+'" data-name="'+_name+'" id="'+_nextID+'" class="inventory-item '+_name+'" data-item-type="'+_type+'"></div>';
			//cell.setAttribute("data-table",inventoryTable);
			return true;
		}
	};
	
	return false;//full
}

function clear_table(inventoryTable){
	let cells = inventoryTable.querySelectorAll('.inventory-cell');
	
	for(let i=0;i<cells.length;i++) {
		let cell=cells[i];
		cell.innerHTML='';
	};
};

function show_player_items(_type){
	let _tarray=player_item_list[_type];
	for(var i=0;i<_tarray.length;i++){
		add_item_to_empty_cell(personal_inventory,_tarray[i],_type);
	}
};
//store_item_list
function show_store_items(_type){
	let _tarray=store_item_list[_type];
	if(typeof _tarray==='undefined'||_tarray===null)return;
	for(var i=0;i<_tarray.length;i++){
		add_item_to_empty_cell(space_station_store,_tarray[i],_type);
	}
};

function get_data(inventoryTable){
	let _rs=new Array();
	let cells = inventoryTable.querySelectorAll('.inventory-cell');
	for(let i=0;i<cells.length;i++) {
		let cell=cells[i];
		if(cell.innerHTML.trim()===''){
			
		}
		else{
			let _item=cell.querySelectorAll('.inventory-item')[0];
			_rs.push(_item.classList[1]);
		}
	};
	return _rs;
}

function update_player_package(){
	player_item_list[current_category]=get_data(personal_inventory);
	store_item_list[current_category]=get_data(space_station_store);
};

function select_category_handle(_type){
	
	clear_table(personal_inventory);
	clear_table(space_station_store);
	
	show_player_items(_type);
	show_store_items(_type);
	current_category=_type;
}


try{
create_inventory_frame(personal_inventory,6,6);
create_inventory_frame(space_station_store,7,7);

//select_category_handle('food');
//let _rs1=get_data(personal_inventory);
//let _rs2=get_data(space_station_store);


document.getElementById("main-container").style.transform="scale(1.5)";
document.getElementById("main-container").style.position="relative";
document.getElementById("main-container").style.top="100px";
}catch(e){alert(e.toString());}

//------------------------------------------------------------

jQuery.fn.extend({
    addRemoveItems: function(targetCount) {
        return this.each(function() {
            var $children = $(this).children();
            var rowCountDifference = targetCount - $children.length;
            //console.log('row count diff: ' + rowCountDifference);
           
            if(rowCountDifference > 0)
            {
                // Add items
                for(var i = 0; i < rowCountDifference; i++)
                {
                    //console.log($rows.first());
                    $children.last().clone().appendTo(this);
                }
            }
            else if(rowCountDifference < 0)
            {
                // remove items
                $children.slice(rowCountDifference).remove();
            }
        });
    },
    // Modified and Updated by MLM
    // Origin: Davy8 (http://stackoverflow.com/a/5212193/796832)
    parentToAnimate: function(newParent, duration) {
        duration = duration || 'slow';
        
		try{
		update_player_package();
		}catch(e){alert(e.toString());}
		
        var $element = $(this);
        //console.log($element);
        if($element.length > 0)
        {
            
            newParent = $(newParent); // Allow passing in either a JQuery object or selector
            var oldOffset = $element.offset();
            $(this).appendTo(newParent);
            var newOffset = $element.offset();
            
            
            var temp = $element.clone().appendTo('body');
            
            temp.css({
                'position': 'absolute',
                'left': oldOffset.left,
                'top': oldOffset.top,
                'zIndex': 1000
            });
            
            $element.hide();
                
            temp.animate({
                'top': newOffset.top,
                'left': newOffset.left
            }, duration, function() {
                $element.show();
                temp.remove();
            });
            
            //console.log("parentTo Animate done");
        }
    }
});



// Sorting, dragging, dropping, etc

refreshSortableInventoryList();
function refreshSortableInventoryList()
{
    $('.inventory-cell').sortable({
        connectWith: '.inventory-cell',
        placeholder: 'inventory-item-sortable-placeholder',
        receive: function( event, ui ) {
            var attrWhitelist = $(this).closest('.inventory-table').attr('data-item-filter-whitelist');
            var attrBlackList = $(this).closest('.inventory-table').attr('data-item-filter-blacklist');
            var itemFilterWhitelistArray = attrWhitelist ? attrWhitelist.split(/\s+/) : [];
            var itemFilterBlacklistArray = attrBlackList ? attrBlackList.split(/\s+/) : [];
            //console.log(itemFilterWhitelistArray);
            //console.log(itemFilterBlacklistArray);  
            
            var attrTypeList = $(ui.item).attr('data-item-type');
            var itemTypeListArray = attrTypeList ? attrTypeList.split(/\s+/) : [];
            //console.log(itemTypeListArray);
            
            var canMoveIntoSlot = verifyWithWhiteBlackLists(itemTypeListArray, itemFilterWhitelistArray, itemFilterBlacklistArray)
            
            if(!canMoveIntoSlot)
            {
                console.log("Can't move to this slot");
                //$(ui.sender).sortable('cancel');
                $(ui.item).parentToAnimate($(ui.sender), 200);
            }
            else                
            {
            
                // Swap places of items if dragging on top of another
                // Add the items in this list to the list the new item was from
                $(this).children().not(ui.item).parentToAnimate($(ui.sender), 200);
                
                // $(this) is the list the item is being moved into
                // $(ui.sender) is the list the item came from
                // Don't forget the move swap items as well
                
                // $(this).attr('data-slot-position-x');
                // $(this).attr('data-slot-position-y');
                // $(ui.sender).attr('data-slot-position-x');
                // $(ui.sender).attr('data-slot-position-y');
                //console.log("Moving to: (" + $(this).attr('data-slot-position-x') + ", " + $(this).attr('data-slot-position-y') + ") - From: (" + $(ui.sender).attr('data-slot-position-x') + ", " + $(ui.sender).attr('data-slot-position-y') + ")");
            }
        }
    }).each(function() {
        // Setup some nice attributes for everything
        // Makes it easier to update the backend
        $(this).attr('data-slot-position-x', $(this).prevAll('.inventory-cell').length);
        $(this).attr('data-slot-position-y', $(this).closest('.inventory-row').prevAll('.inventory-row').length);
    }).disableSelection();
}

function verifyWithWhiteBlackLists(itemList, whiteList, blackList)
{
    // itemList should contain tags
    // whiteList and blackList can contain tags and tag queries
    
    // If we have a matching tags to some tag query in the whiteList but not in the blackList, then return true
    // Else return false
    
    
    console.group("Lists");
    console.log(itemList);
    console.log(whiteList);
    console.log(blackList);
    console.groupEnd();

    // If white and black lists are empty, return true
    // Save the calculations, no filtering
    if(whiteList.length == 0 && blackList.length == 0)
        return true;
    

    
    // Check if the itemList has an item in the blackList
    var inBlackList = false;
    $.each(blackList, function(index, value) {
        var itemBlack = value;
        var itemBlackAndArray = itemBlack.split(/\+/);
        console.log(itemBlackAndArray);
        
        var andedResult = true;
        for(var i = 0; i < itemBlackAndArray.length; i++)
        {
            if(blackList.length > 0 && $.inArray(itemBlackAndArray[i], itemList) !== -1)
            {
                andedResult = andedResult && true;
            }
            else
            {
                andedResult = andedResult && false;
            }
        }
        
        if(andedResult)
            inBlackList = true;
    });
    
    inBlackList = blackList.length > 0 ? inBlackList : false;
    
    
    // Check if the itemList has an item in the whiteList
    var inWhiteList = false;
    $.each(whiteList, function(index, value) {
        var itemWhite = value;
        var itemWhiteAndArray = itemWhite.split(/\+/);
        //console.log(itemWhiteAndArray);
        
        var andedResult = true;
        for(var i = 0; i < itemWhiteAndArray.length; i++)
        {
            if(whiteList.length > 0 && $.inArray(itemWhiteAndArray[i], itemList) !== -1)
            {
                andedResult = andedResult && true;
            }
            else
            {
                andedResult = andedResult && false;
            }
        }
        //console.log("andedResult: " + andedResult);
        
        if(andedResult)
            inWhiteList = true;
       
    });
    
    inWhiteList = whiteList.length > 0 ? inWhiteList : false;
    
    
    console.log("inWhite: " + inWhiteList + " - inBlack: " + inBlackList);
    
    if((whiteList.length == 0 || inWhiteList) && !inBlackList)
        return true;
    
    return false;
}