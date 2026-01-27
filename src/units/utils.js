import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

class Utils{
	constructor(params){
		this.axisX=new THREE.Vector3(1,0,0);
		this.axisY=new THREE.Vector3(0,1,0);
		this.axisZ=new THREE.Vector3(0,0,1);
	}
	radToDeg(radians) {//chuyển từ radian sang độ
		return radians * (180 / Math.PI);
	}
	degToRad(deg) {
		return deg * Math.PI / 180;
	}
	calculateAngleDeg(P1, P2, P3){//tính góc giữa 2 đường thẳng P1P2 và P1P3, Chuyển từ radian sang độ
		var angle=this.calculateAngle(P1, P2, P3);
		angle = this.radToDeg(angle);
		
		return angle;
	}
	calculateAngle(P1, P2, P3) {//tính góc giữa 2 đường thẳng P1P2 và P1P3
   
		 var vectorP1P2 = new THREE.Vector3(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
		 var vectorP1P3 = new THREE.Vector3(P3.x - P1.x, P3.y - P1.y, P3.z - P1.z);

		 // Tính độ dài của hai đoạn thẳng
		 var lengthP1P2 = vectorP1P2.length();
		 var lengthP1P3 = vectorP1P3.length();

		 // Tính cosin của góc giữa hai đoạn thẳng
		 var cosTheta = vectorP1P2.dot(vectorP1P3) / (lengthP1P2 * lengthP1P3);

		 // Tính góc giữa hai đoạn thẳng
		 var angle = Math.acos(cosTheta);

		return angle;
	}
	/*Chi ap dung cho 2 unit*/
	isInFront90(object1, object2) {//kiem tra xem object2 co nam trong goc 90 do phia truoc object1 hay ko
		let cameraDir = new THREE.Vector3();
		object1.getWorldDirection(cameraDir).normalize();

		let camToObj = new THREE.Vector3();
		camToObj.subVectors(object2.position, object1.position).normalize();

		let dot = cameraDir.dot(camToObj);

		return !(dot >= Math.cos(this.degToRad(45)));
	}
	
	shuffle_array(array)
	{
		var currentIndex = array.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};
	get_random_elements_from_array=function(arr, n)
	{
		var result = new Array(n),
			len = arr.length,
			taken = new Array(len);
		if (n > len)
			throw new RangeError("getRandom: more elements taken than available");
		while (n--) {
			var x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
		}
		return result;
	};
	get_random_in_range(min,max)//Interger
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	};

	//cho điểm P1 và P2,tính khoảng cách từ điểm P3 tới đường thẳng đi qua 2 điểm P1 và P2
	distanceToLine(P1, P2, P3) {
		// Tính vector điểm P1 tới P2
		const vectorP1P2 = { 
			x: P2.x - P1.x, 
			y: P2.y - P1.y, 
			z: P2.z - P1.z 
		};

		// Tính vector từ P1 tới P3
		const vectorP1P3 = {
			x: P3.x - P1.x,
			y: P3.y - P1.y,
			z: P3.z - P1.z
		};

		// Tính chiều dài của vector P1P2
		const lengthP1P2 = Math.sqrt(
			vectorP1P2.x ** 2 + vectorP1P2.y ** 2 + vectorP1P2.z ** 2
		);

		// Tính khoảng cách từ P3 tới đường thẳng P1P2
		const distance = Math.abs(
			(vectorP1P3.x * vectorP1P2.x + vectorP1P3.y * vectorP1P2.y + vectorP1P3.z * vectorP1P2.z) / lengthP1P2
		);

		return distance;
	}
	
	//tham số nhập vào là điểm P1(x,y,z) và điểm P2(x,y,z) và Length là một số nguyên, 
//kết quả trả về là điểm P3 nằm trên đường thẳng đi qua P1 và P2 theo hướng từ P1 tới P2 
//và điểm P3 nằm cách điểm P1 một khoảng có chiều dài là Length
findPointOnLine(p1, p2, length) {
    // Tính vector hướng từ P1 đến P2
    const directionVector = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };

    // Tính chiều dài của vector hướng
    const directionLength = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);

    // Chuẩn hóa vector hướng
    const normalizedDirection = {
        x: directionVector.x / directionLength,
        y: directionVector.y / directionLength,
        z: directionVector.z / directionLength
    };

    // Tính tọa độ của điểm P3
    const p3 = new THREE.Vector3(
        p1.x + normalizedDirection.x * length,
        p1.y + normalizedDirection.y * length,
        p1.z + normalizedDirection.z * length
    );

    return p3;
}

// Hàm tạo điểm P3 nằm giữa P1 và P2
findMidpoint(p1, p2) {
    const midpoint = new THREE.Vector3();
    midpoint.x = (p1.x + p2.x) / 2;
    midpoint.y = (p1.y + p2.y) / 2;
    midpoint.z = (p1.z + p2.z) / 2;
    return midpoint;
}

	
	//cho điểm P1 và D là vector chỉ hướng của P1
	//Kiểm tra xem điểm P2 nằm về hướng nào của P1
	isSameDirection(P1, D, P2) {
		// Tính vector từ P1 đến P2
		const vectorP1P2 = {
			x: P2.x - P1.x,
			y: P2.y - P1.y,
			z: P2.z - P1.z,
		};

		// Tính tích vô hướng giữa vector P1P2 và vector chỉ hướng D
		const dotProduct = vectorP1P2.x * D.x + vectorP1P2.y * D.y + vectorP1P2.z * D.z;

		if (dotProduct > 0) {//Phía cùng hướng với P1
			return true;
		} else if (dotProduct < 0) {//Phía đối diện với P1
			return false;
		} else {//Cùng vị trí
			return false;
		}
	}
	
	//cho điểm P1,P2 và P3, tính góc giữa 2 đường thẳng P1P2 và P1P3
	calculateAngleBetweenLines(P1, P2, P3) {
		// Chuyển điểm thành vector
		const vectorP1 = new THREE.Vector3(P1.x, P1.y, P1.z);
		const vectorP2 = new THREE.Vector3(P2.x, P2.y, P2.z);
		const vectorP3 = new THREE.Vector3(P3.x, P3.y, P3.z);

		// Tính vector hướng của đường thẳng P1P2
		const vectorP1P2 = new THREE.Vector3().subVectors(vectorP2, vectorP1).normalize();

		// Tính vector hướng của đường thẳng P1P3
		const vectorP1P3 = new THREE.Vector3().subVectors(vectorP3, vectorP1).normalize();

		// Hàm clamp để đảm bảo giá trị nằm trong khoảng [-1, 1]
		Math.clamp = function (value, min, max) {
			return Math.min(max, Math.max(min, value));
		}
		// Sử dụng phương trình dot product để tính góc giữa hai đường thẳng
		const dotProduct = vectorP1P2.dot(vectorP1P3);
		const angleRadians = Math.acos(Math.clamp(dotProduct, -1, 1)); // Áp dụng hàm clamp để đảm bảo giá trị trong khoảng [-1, 1]
		
		return angleRadians;
	}
	rotateObjectAroundPoint(object, point, axis, angle) {
		// Tạo ma trận xoay xung quanh trục được chỉ định
		var rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), angle);
    
		// Dịch chuyển về điểm gốc
		var inversePoint = point.clone().negate();
		object.position.add(inversePoint);

		// Xoay object quanh điểm gốc
		object.position.applyQuaternion(rotationQuaternion);
		object.quaternion.multiply(rotationQuaternion);

		// Dịch chuyển về vị trí ban đầu
		object.position.add(point);
	}
	rotateAboutPoint(obj, point, axis, theta, pointIsWorld)//ham nay hinh nhu chi work khi pointIsWorld=false
	{
		pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

		if(pointIsWorld){
			obj.parent.localToWorld(obj.position); // compensate for world coordinate
		}

		obj.position.sub(point); // remove the offset
		obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
		obj.position.add(point); // re-add the offset

		if(pointIsWorld){
			obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
		}

	}
	getRandomNumberInRange(min_number, max_number) {
		if (min_number > max_number) {
			// Đảm bảo rằng min_number không lớn hơn max_number
			[min_number, max_number] = [max_number, min_number];
		}

		// Lấy một số ngẫu nhiên từ 0 đến 1
		const random = Math.random();

		// Chuyển đổi số ngẫu nhiên thành khoảng từ min_number đến max_number
		const range = max_number - min_number + 1;
		const randomNumberInRange = Math.floor(random * range) + min_number;

		return randomNumberInRange;
	}
	
	//tim diem P4 biet rang P1P2P3P4 la 1 hinh chu nhat (P3P1P2 la goc vuong)
	findPointP4(P1,P2,P3){
		 const P4 = new THREE.Vector3();
		 P4.addVectors(P2, P3).sub(P1);
	  
	    return P4;
	}
	
	//cho điểm P1(x1,y1,z1) và điểm P2(x2,y2,z2), 
	//tìm tọa độ điểm P3(x3,y3,z3) biết rằng 2 đường thẳng P1P2 và P1P3 có 
	//chiều dài bằng nhau và tạo thành một góc vuông, ngoài ra còn có z3=z2
	findPointP3(P1, P2) {
		const x1 = P1.x;
		const y1 = P1.y;
		const z1 = P1.z;

		const x2 = P2.x;
		const y2 = P2.y;
		const z2 = P2.z;

		// Tính khoảng cách giữa P1 và P2
		const distanceP1P2 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

		// Tạo vectơ giữa P1 và P2
		const vectorP1P2 = {
			x: x2 - x1,
			y: y2 - y1,
			z: z2 - z1
		};

		// Tính tọa độ x3, y3, z3
		const x3 = x2;
		const y3 = y1 + vectorP1P2.y;
		const z3 = y1 + vectorP1P2.y;

		return new THREE.Vector3(x3,y3,z3);
	}

	
	//Cho diem A(x1,y1,z1) và Vector chi huong cua A la D(x2,y2,z2)
	//Tim diem B nam cach A 1 khoang theo huong D
	findPointB(x1, y1, z1, x2, y2, z2, distance) {
		const lengthD = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
		// Chuẩn hóa vector D để có độ dài 1
		const normalizedD = {
			x: x2 / lengthD,
			y: y2 / lengthD,
			z: z2 / lengthD,
		};

		// Tính tọa độ của điểm B
		const xB = x1 + normalizedD.x * distance;
		const yB = y1 + normalizedD.y * distance;
		const zB = z1 + normalizedD.z * distance;

		//return { x: xB, y: yB, z: zB };
		return new THREE.Vector3(xB,yB,zB);
		//return _B;
	}
	
	translateObject(object,position,distance){//dịch chuyển object theo hướng tới position
		const _next_pos=this.translatePoint(object.position,position,distance);
		object.position.set(_next_pos.x,_next_pos.y,_next_pos.z);
	}
	translatePoint(p1, p2, distance) {//dịch chuyển điểm P1 tiến tới gần điểm P2 một khoảng quãng đường là d
		// Tính toán vector hướng từ P1 đến P2
		const directionVector = {
			x: p2.x - p1.x,
			y: p2.y - p1.y,
			z: p2.z - p1.z
		};
		
		// Tính độ dài của vector hướng
		const directionLength = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2 + directionVector.z ** 2);
    
		// Chuẩn hóa vector hướng để có hướng di chuyển
		const normalizedDirection = {
			x: directionVector.x / directionLength,
			y: directionVector.y / directionLength,
			z: directionVector.z / directionLength
		};
    
		// Tính toán vị trí mới của P1 sau khi di chuyển
		const newP1 = {
			x: p1.x + normalizedDirection.x * distance,
			y: p1.y + normalizedDirection.y * distance,
			z: p1.z + normalizedDirection.z * distance
		};
    
		return newP1;
	}
	
	calculateSymmetricPoint(pointA, pointB) {//tinh' toa do diem doi xung' cua pointA qua pointB
		const x1 = pointA.x;
		const y1 = pointA.y;
		const z1 = pointA.z;

		const x2 = pointB.x;
		const y2 = pointB.y;
		const z2 = pointB.z;

		const xC = 2 * x1 - x2;
		const yC = 2 * y1 - y2;
		const zC = 2 * z1 - z2;

		return new THREE.Vector3(xC,yC,zC);
	}
	
	getEquidistantPoints(P1, P2, N) {//tìm N điểm cách đều nhau nằm trên đường thẳng P1P2
    // Kiểm tra số lượng điểm N có hợp lệ không (phải lớn hơn 1)
    if (N < 2) {
        throw new Error("N phải lớn hơn hoặc bằng 2 để có ít nhất 2 điểm cách đều nhau.");
    }

    // Tạo hai vector từ hai điểm P1 và P2
    const point1 = new THREE.Vector3(P1.x, P1.y, P1.z);
    const point2 = new THREE.Vector3(P2.x, P2.y, P2.z);

    // Tính vector chỉ phương của đường thẳng P1P2
    const direction = new THREE.Vector3().subVectors(point2, point1);
    
    // Tính khoảng cách giữa các điểm
    const segmentLength = 1.0 / (N - 1);

    // Mảng lưu trữ các điểm cách đều nhau
    const points = [];

    // Tạo N điểm cách đều nhau
    for (let i = 0; i < N; i++) {
        const t = i * segmentLength;
        const point = new THREE.Vector3().lerpVectors(point1, point2, t);
        points.push(point);
    }

    return points;
}

/*
Kết quả trả về là một mảng chứa N điểm cách đều nhau nằm trên đường tròn có tâm là C đi qua 2 điểm P1 và P2
Hãy tham khảo cách sử dụng tại additional-skill
*/
createPointsOnCircle(C, P1, P2, N) {
   const v1 = new THREE.Vector3().subVectors(P1, C).normalize();
    
    // Tạo vector từ C đến P2
    const v2Temp = new THREE.Vector3().subVectors(P2, C);
    
    // Tạo vector pháp tuyến của mặt phẳng chứa đường tròn
    const normal = new THREE.Vector3().crossVectors(v1, v2Temp).normalize();
    
    // Tính toán vector thứ hai trên mặt phẳng đường tròn
    const v2 = new THREE.Vector3().crossVectors(normal, v1).normalize();
    
    // Bán kính của đường tròn
    const radius = new THREE.Vector3().subVectors(P1, C).length();

    // Mảng lưu các điểm
    const points = [];

    // Góc chia đều cho các điểm
    const angleStep = (2 * Math.PI) / N;

    for (let i = 0; i < N; i++) {
        const angle = i * angleStep;

        // Tính toán vị trí điểm
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const point = new THREE.Vector3()
            .addVectors(
                new THREE.Vector3().copy(v1).multiplyScalar(x),
                new THREE.Vector3().copy(v2).multiplyScalar(y)
            )
            .add(C);  // Dịch về vị trí gốc C

        points.push(point);
    }

    return points;
}


}
export {Utils}