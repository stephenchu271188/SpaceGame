import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {particles} from './particles.js';
import {math} from './math.js';

/*
	Tạo ra nhiều particles cùng lúc. Mỗi particle là 1 ảnh(texture)
	Các particles hiển thị đồng thời tạo ra hình ảnh vụ nổ
*/

class ExplodeParticles_1 {
  constructor(game) {
    this._particleSystem = new particles.ParticleSystem(
        game, {texture: "./resources/shining1.jpg"});
    this._particles = [];
  }

  Splode(origin) {
    for (let i = 0; i < 50; i++) {
      const p = this._particleSystem.CreateParticle();
      p.Position.copy(origin);
      p.Velocity = new THREE.Vector3(
          math.rand_range(-1, 1),
          math.rand_range(-1, 1),
          math.rand_range(-1, 1)
      );
      p.Velocity.normalize();
      p.Velocity.multiplyScalar(50);
      p.TotalLife = 0.6;
      p.Life = p.TotalLife;
      p.Colours = [new THREE.Color(0xffffff ), new THREE.Color(0xffffff )];
      p.Sizes = [1, 4];//kích thước mỗi mảnh
      p.Size = p.Sizes[0];
      this._particles.push(p);
    }
  
  }

  Update(timeInSeconds) {
    const _V = new THREE.Vector3();

    this._particles = this._particles.filter(p => {
      return p.Alive;
    });
    for (const p of this._particles) {
      p.Life -= timeInSeconds;
      if (p.Life <= 0) {
        p.Alive = false;
      }
      p.Position.add(p.Velocity.clone().multiplyScalar(timeInSeconds));

      _V.copy(p.Velocity);
      _V.multiplyScalar(10.0 * timeInSeconds);
      const velocityLength = p.Velocity.length();

      if (_V.length() > velocityLength) {
        _V.normalize();
        _V.multiplyScalar(velocityLength)
      }

      p.Velocity.sub(_V);
      p.Size = math.lerp(p.Life / p.TotalLife, p.Sizes[0], p.Sizes[1]);
      p.Colour.copy(p.Colours[0]);
      p.Colour.lerp(p.Colours[1], 1.0 - p.Life / p.TotalLife);
      p.Opacity = math.smootherstep(p.Life / p.TotalLife, 0.0, 1.0);
    }
    this._particleSystem.Update();
  }
};

export {ExplodeParticles_1}