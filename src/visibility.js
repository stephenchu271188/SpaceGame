import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {math} from './math.js';

/*
quản lý việc hiển thị các đối tượng trong không gian 3D theo các ô lưới, giúp tối 
ưu hóa việc truy cập và xử lý các đối tượng trong không gian.
*/

export const visibility = (function() {
  return {
      VisibilityGrid: class {
        constructor(bounds, dimensions) {
          const [x, y] = dimensions;
          this._cells = [...Array(x)].map(_ => [...Array(y)].map(_ => ({})));//mảng 2 chiều lưu trữ các đối tượng hiển thị trong các ô lưới.
          this._dimensions = dimensions;//Kích thước của lưới (số hàng và số cột).
          this._bounds = bounds;//Các giới hạn của không gian 3D.
          this._cellSize = bounds[1].clone().sub(bounds[0]);//Kích thước của mỗi ô lưới.
          this._cellSize.multiply(
              new THREE.Vector3(1.0 / dimensions[0], 0, 1.0 / dimensions[1]));
          this._globalItems = [];//Một mảng lưu trữ các đối tượng toàn cục.
        }

        AddGlobalItem(entity) {//Thêm một đối tượng toàn cục vào lưới.
          this._globalItems.push(entity);
        }

        GetGlobalItems() {
          return [...this._globalItems];
        }

        RemoveItem(uuid, previous) {
          const [prevX, prevY] = previous;

          delete this._cells[prevX][prevY][uuid];
        }

	//Cập nhật vị trí của một đối tượng trong lưới dựa trên UUID và vị trí trước 
	//đó của đối tượng. Nếu vị trí trước đó được cung cấp, đối tượng sẽ được di 
	//chuyển từ ô lưới cũ sang ô lưới mới.
        UpdateItem(uuid, entity, previous=null) {
          const [x, y] = this._GetCellIndex(entity.Position);

          if (previous) {
            const [prevX, prevY] = previous;
            if (prevX == x && prevY == y) {
              return [x, y];
            }

            delete this._cells[prevX][prevY][uuid];
          }
          this._cells[x][y][uuid] = entity;

          return [x, y];
        }

	//Trả về một mảng các đối tượng hiển thị trong bán kính xác định từ vị trí 
	//được cung cấp. Phương thức này sẽ lấy các đối tượng trong các ô lưới xung quanh 
	//vị trí này.
        GetLocalEntities(position, radius) {
          const [x, y] = this._GetCellIndex(position);

          const cellSize = Math.min(this._cellSize.x, this._cellSize.z);
          const cells = Math.ceil(radius / cellSize);

          let local = [];
          const xMin = Math.max(x - cells, 0);
          const yMin = Math.max(y - cells, 0);
          const xMax = Math.min(this._dimensions[0] - 1, x + cells);
          const yMax = Math.min(this._dimensions[1] - 1, y + cells);
          for (let xi = xMin; xi <= xMax; xi++) {
            for (let yi = yMin; yi <= yMax; yi++) {
              local.push(...Object.values(this._cells[xi][yi]));
            }
          }

          local = local.filter((e) => {
            const distance = e.Position.distanceTo(position);

            return distance != 0.0 && distance < radius;
          });

          return local;
        }

		//xác định chỉ số (x, y) của ô lưới chứa vị trí được cung cấp.
        _GetCellIndex(position) {
          const x = math.sat((this._bounds[0].x - position.x) / (
              this._bounds[0].x - this._bounds[1].x));
          const y = math.sat((this._bounds[0].z - position.z) / (
              this._bounds[0].z - this._bounds[1].z));

          const xIndex = Math.floor(x * (this._dimensions[0] - 1));
          const yIndex = Math.floor(y * (this._dimensions[1] - 1));

          return [xIndex, yIndex];
        }
      }
  };
})();
