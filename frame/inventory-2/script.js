document.getElementById("menu").style.transform ="scale(1,1)";


//=================TOOLTIP====================
let tooltip = document.querySelectorAll(".tooltip");
let itemTooltip = document.querySelectorAll(".item__tooltip");

document.addEventListener("mousemove", fn);

function fn(e) {
  tooltip.forEach((t) => {
    let x = e.clientX;
    let y = e.clientY;

    let newposX = x / 20;
    let newposY = y / 2;
    t.style.transform = "translate3d(" + newposX + "px," + newposY + "px,0px)";
  });

  itemTooltip.forEach((t) => {
    let x = e.clientX;
    let y = e.clientY;

    let newposX = x / 30;
    let newposY = y / 10;
    t.style.transform = "translate3d(" + newposX + "px," + newposY + "px,0px)";
  });
}

//=======DRAG AND DROP================
const items = document.querySelectorAll(".item__container");
const itemContainers = document.querySelectorAll(".items__container");

items.forEach((item) => {
  item.addEventListener("dragstart", dragStart);
});

itemContainers.forEach((square) => {
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let beingDragged;

function dragStart(e) {
  beingDragged = e.target;

  let img = new Image();
  img.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
  e.dataTransfer.setDragImage(img, 0, 0);
}

function dragDrop(e) {
  if (e.target.tagName === "IMG") {
    return;
  }

  e.target.append(beingDragged);
}

function dragOver(e) {
  e.preventDefault();
}


function show_message(_msg){
	// Tạo modal container
const modalContainer = document.createElement('div');
modalContainer.style.position = 'fixed';
modalContainer.style.top = '0';
modalContainer.style.left = '0';
modalContainer.style.width = '100%';
modalContainer.style.height = '100%';
modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
modalContainer.style.display = 'flex';
modalContainer.style.justifyContent = 'center';
modalContainer.style.alignItems = 'center';
modalContainer.style.zIndex = '9999';

// Tạo message box
const messageBox = document.createElement('div');
messageBox.style.backgroundColor = 'white';
messageBox.style.padding = '20px';
messageBox.style.borderRadius = '5px';
messageBox.style.textAlign = 'center';
messageBox.style.backgroundColor="turquoise";
messageBox.style.color="white";

const title = document.createElement('h1');
title.textContent = 'Alert';
title.style.fontSize = '24px'; // Đặt kích thước phông chữ to

// Tạo nội dung message
const message = document.createTextNode(_msg);

// Tạo nút OK
const okButton = document.createElement('button');
okButton.textContent = 'OK';
okButton.addEventListener('click', () => {
  // Xóa modal khi nút OK được click
  document.body.removeChild(modalContainer);
});

messageBox.appendChild(title);
messageBox.appendChild(document.createElement('br'));
messageBox.appendChild(message);
messageBox.appendChild(document.createElement('br'));
messageBox.appendChild(okButton);


// Thêm message box vào modal container
modalContainer.appendChild(messageBox);

// Thêm modal container vào body
document.body.appendChild(modalContainer);

};