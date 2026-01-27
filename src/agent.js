import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

import {math} from './math.js';
/*
	*Fix lai rotation cua ship trong combat-moede
	*Trong showroom: thong bao chua co sub-skill khi bam vao nut play
	*Trong defense-mode ko hien thi mouse khi game over
	*kiem tra lai xem khi new spaceship dc unlock va player da mua thi exp-item co duoc thong bao mua ko
	*Hien thi text va sound thong bao khi het rocket trong khi choi
	*Skill generate photon 1 qua' manh can giam dammage 
	*Xem xet them wave
	*Cac skill icon da so huu va chua so huu nhin ko khac nhau lam, can sua de phan biet cho ro
	*Xem lai suc manh cua rocket 7(rocket ban' xa nhat)
	*Tang level require cua cac rocket tu 5->8 (tang len tam 3 level)
	*Skill ban' lien hoan laser yellow can check xem trong defend-planet co' ban' nhieu huong hay ko(ko dc ban' ve phia sau_
	*Error: khi click vao main skill icon, main skill icon ko bi blur 
	*Thong bao khi player dat dieu kien de mua ship moi'
	
	*Them dong hien thi thong bao sap duoc unlock cua cac game mode khi player sap dat dieu kien
	*Khi skill moi duoc active, khi player mo skill panel ra thi tao hieu ung' tai icon cua skill do
	*Them icon mui ten(arrow) tai icon cua skill khi skill du dieu kien de upgrade
	*Moi khi 1 rocket duoc activate thi tang luon cho player 1 so luong tu 10=>20
	*Them upgrade button vao panel khi click vao icon cua cac skills trong add-skills panel trong showroom
	*Auto tao account va login cho ko mat thoi gian cua player
	*Xem xet loai bo kha nang anti-rocket cua default-skill cua ship thu 5, 
		va generate-photon-1 skill
		
	*Armour panel ko close khi chuyen sang ship khac
	*Khi vao showroom, kiem tra neu ko full rocket trong package thi hien thi mui ten chi vao rocket button
	*Xem xet moi player-ship se co 1 so second-skill ma ship khac ko co
		(boi vi hien tai cac ship chi khac nhau main-skill khien ko khac biet nhieu)
	
	*remove arrow(chi vao cac button) khi next sang ship khac(trong showroom)

	-Sau khi finish level 1 trong space-tunnel khi vao shop se thong bao yeu cau vao mua rocket
	
	-Fix all missiles
	-Game Menu after finish game
	-Loc bot' planet texture
	-Fix photon ship position error
	-Khi mua ship moi phai hien thong bao huong dan mua Exp
	-Xem xet giam bot so luong enemy=ship trong dead Universe
	-Hide gear-box trong mission
	-Tim particle khac cho Sun
	-fix loi add-remove rocket trong showroom
	-kiem tra cac nut' next-prev skill
	
	-Thong bao loi khi dang nhap
	-Trong combat mode xay ra truong hop ca 2 cung die cung luc
	-Ko de cho user choi 2 lan bang 2 widow/browser cung luc
	-Hien thi max-level cua add-skill khi da dat level cao nhat
	-Light-Shield Icon khi perform skill van phat' sang' sau 6 giay(phai la sau 50 giay)
	-Khi click vao armour icon phai hien thi thong tin cua armour
*/
//https://www.shadertoy.com/view/Mly3WV

export const agent = (function() {

  const _BOID_FORCE_ORIGIN = 50;
  const _BOID_FORCE_ALIGNMENT = 10;
  const _BOID_FORCE_SEPARATION = 20;
  const _BOID_FORCE_COLLISION = 50;
  const _BOID_FORCE_COHESION = 5;
  const _BOID_FORCE_WANDER = 3;
  
  const _M = new THREE.Matrix4();
  const _V = new THREE.Vector3();
  const _A = new THREE.Vector2();
  const _B = new THREE.Vector2();
  const _AP = new THREE.Vector2();
  const _AB = new THREE.Vector2();
  const _BA = new THREE.Vector2();
  const _PT2 = new THREE.Vector2();
  const _PT3 = new THREE.Vector3();

  const _Q = new THREE.Quaternion();
  const _V_0 = new THREE.Vector3(0, 0, 0);
  const _V_Y = new THREE.Vector3(0, 1, 0);
  const _V_SC_0_1 = new THREE.Vector3(0.1, 0.1, 0.1);

  function _Key(x, y) {
    return x + '.' + y;
  }
  
  class LineRenderer {
    constructor(game) {
      this._game = game;
  
      this._materials = {};
      this._group = new THREE.Group();
  
      this._game._graphics.Scene.add(this._group);
    }
  
    Reset() {
      this._lines = [];
      this._group.remove(...this._group.children);
    }
  
    Add(pt1, pt2, hexColour) {
      const geometry = new THREE.Geometry();
      geometry.vertices.push(pt1.clone());
      geometry.vertices.push(pt2.clone());
  
      let material = this._materials[hexColour];
      if (!material) {
        this._materials[hexColour] = new THREE.LineBasicMaterial(
            {
              color: hexColour,
              linewidth: 3,
            });
        material = this._materials[hexColour];
      }
  
      const line = new THREE.Line(geometry, material);
      this._lines.push(line);
      this._group.add(line);
    }
  }
  

  class _Agent {
    constructor(game, params) {
      this._mesh = params.mesh;
  
      this._group = new THREE.Group();
      this._group.add(this._mesh);
      this._group.position.set(
          math.rand_range(-250, 250),
          math.rand_range(-250, 250),
          math.rand_range(-250, 250));
      this._group.position.add(params.seekGoal);

      this._direction = new THREE.Vector3(
          math.rand_range(-1, 1),
          math.rand_range(-1, 1),
          math.rand_range(-1, 1));
      this._velocity = this._direction.clone();
  
      const speedMultiplier = math.rand_range(params.speedMin, params.speedMax);
      this._maxSteeringForce = params.maxSteeringForce * speedMultiplier;
      this._maxSpeed  = params.speed * speedMultiplier;
      this._acceleration = params.acceleration * speedMultiplier;
  
      const scale = 1.0 / speedMultiplier;
      this._radius = scale;
  
      this._game = game;
      game._graphics.Scene.add(this._group);
      this._visibilityIndex = game._visibilityGrid.UpdateItem(
          this._mesh.uuid, this);
  
      this._wanderAngle = 0;
      this._seekGoal = params.seekGoal;
      this._fireCooldown = 0.0;
      this._params = params;
      this._health = 100.0;
	  
	  this._after_dead_fc=function(){};
    }
  
    get Enemy() {
      return true;
    }

    get Position() {
      return this._group.position;
    }
  
    get Velocity() {
      return this._velocity;
    }
  
    get Direction() {
      return this._direction;
    }
  
    get Radius() {
      return this._radius;
    }
  
    get Health() {
      return this._health;
    }

    get Dead() {
      return (this._health <= 0.0);
    }
  
    TakeDamage(dmg) {
      this._health -= dmg;
      if (this._health <= 0.0) {
        this._game._entities['_explosionSystem'].Splode(this.Position);
        this.remove();
        //this._game.EnemyDied();
		
		this._after_dead_fc();
      }    
    }
	remove(){
		this._game._visibilityGrid.RemoveItem(this._mesh.uuid, this._visibilityIndex);
        this._game._graphics.Scene.remove(this._group);
	}
  
    Update(timeInSeconds) {
		try{
      if (this.Dead) {
        return;
      }
  
      const local = this._game._visibilityGrid.GetLocalEntities(
          this.Position, 15);
  
      this._ApplySteering(timeInSeconds, local);
  
      const frameVelocity = this._velocity.clone();
      frameVelocity.multiplyScalar(timeInSeconds);
      this._group.position.add(frameVelocity);
  
      this._group.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), this.Direction);
  
      this._visibilityIndex = this._game._visibilityGrid.UpdateItem(
          this._mesh.uuid, this, this._visibilityIndex);
  
      if (this._displayDebug) {
        this._UpdateDebug(local);
      }
	  
		}catch(e){alert(e.toString());}
    }
  
    _ApplySteering(timeInSeconds, local) {
      const separationVelocity = this._ApplySeparation(local);
  
      // Only apply alignment and cohesion to allies
      const allies = local.filter((e) => {
        return (e.Enemy && this._seekGoal.equals(e._seekGoal));
      });
  
      this._fireCooldown -= timeInSeconds;
      if (this._fireCooldown <= 0.0) {
        const neighbourhood = this._game._visibilityGrid.GetLocalEntities(
          this.Position, 100);
  
        const enemies = neighbourhood.filter((e) => {
          return !e.Enemy;
        });

        if (enemies.length > 0) {
			/*
          const p = this._game._entities['_blasterSystem'].CreateParticle();
          p.Start = this.Direction.clone();
          p.Start.multiplyScalar(100.0);
          p.Start.add(this.Position);
          p.End = p.Start.clone();
          p.Velocity = this.Direction.clone().multiplyScalar(500);
          p.Length = 25;
          p.Colours = [
              this._params.colour.clone(), new THREE.Color(0.0, 0.0, 0.0)];
          p.Life = 1.0;
          p.TotalLife = 1.0;
          p.Width = 0.25;
    
          this._fireCooldown = 0.5;
		  */
        }
		
      }
  
      const alignmentVelocity = this._ApplyAlignment(allies);
      const cohesionVelocity = this._ApplyCohesion(allies);
      const originVelocity = this._ApplySeek(this._seekGoal);
      const wanderVelocity = this._ApplyWander();
      const collisionVelocity = this._ApplyCollisionAvoidance();
  
      const steeringForce = new THREE.Vector3(0, 0, 0);
      steeringForce.add(separationVelocity);
      steeringForce.add(alignmentVelocity);
      steeringForce.add(cohesionVelocity);
      steeringForce.add(originVelocity);
      steeringForce.add(wanderVelocity);
      steeringForce.add(collisionVelocity);
  
      steeringForce.multiplyScalar(this._acceleration * timeInSeconds);
  
      // Clamp the force applied
      if (steeringForce.length() > this._maxSteeringForce) {
        steeringForce.normalize();
        steeringForce.multiplyScalar(this._maxSteeringForce);
      }
  
      this._velocity.add(steeringForce);
  
      // Clamp velocity
      if (this._velocity.length() > this._maxSpeed) {
        this._velocity.normalize();
        this._velocity.multiplyScalar(this._maxSpeed);
      }
  
      this._direction = this._velocity.clone();
      this._direction.normalize();
    }
  
    _ApplyCollisionAvoidance() {
      const colliders = this._game._visibilityGrid.GetGlobalItems();
  
      const ray = new THREE.Ray(this.Position, this.Direction);
      const force = new THREE.Vector3(0, 0, 0);
  
      for (const c of colliders) {
        if (c.Position.distanceTo(this.Position) > c.QuickRadius) {
          continue;
        }
  
        const result = ray.intersectBox(c.AABB, new THREE.Vector3());
        if (result) {
          const distanceToCollision = result.distanceTo(this.Position);
          if (distanceToCollision < 2) {
            let a = 0;
          }
          const dirToCenter = c.Position.clone().sub(this.Position).normalize();
          const dirToCollision = result.clone().sub(this.Position).normalize();
          const steeringDirection = dirToCollision.sub(dirToCenter).normalize();
          steeringDirection.multiplyScalar(_BOID_FORCE_COLLISION);
          force.add(steeringDirection);
        }
      }
  
      return force;
    }
  
    _ApplyWander() {
      this._wanderAngle += 0.1 * math.rand_range(-2 * Math.PI, 2 * Math.PI);
      const randomPointOnCircle = new THREE.Vector3(
          Math.cos(this._wanderAngle),
          0,
          Math.sin(this._wanderAngle));
      const pointAhead = this._direction.clone();
      pointAhead.multiplyScalar(5);
      pointAhead.add(randomPointOnCircle);
      pointAhead.normalize();
      return pointAhead.multiplyScalar(_BOID_FORCE_WANDER);
    }
  
    _ApplySeparation(local) {
      if (local.length == 0) {
        return new THREE.Vector3(0, 0, 0);
      }
  
      const forceVector = new THREE.Vector3(0, 0, 0);
      for (let e of local) {
        const distanceToEntity = Math.max(
            e.Position.distanceTo(this.Position) - 1.5 * (this.Radius + e.Radius),
            0.001);
        const directionFromEntity = new THREE.Vector3().subVectors(
            this.Position, e.Position);
        const multiplier = (_BOID_FORCE_SEPARATION / distanceToEntity);
        directionFromEntity.normalize();
        forceVector.add(
            directionFromEntity.multiplyScalar(multiplier));
      }
      return forceVector;
    }
  
    _ApplyAlignment(local) {
      const forceVector = new THREE.Vector3(0, 0, 0);
  
      for (let e of local) {
        const entityDirection = e.Direction;
        forceVector.add(entityDirection);
      }
  
      forceVector.normalize();
      forceVector.multiplyScalar(_BOID_FORCE_ALIGNMENT);
  
      return forceVector;
    }
  
    _ApplyCohesion(local) {
      const forceVector = new THREE.Vector3(0, 0, 0);
  
      if (local.length == 0) {
        return forceVector;
      }
  
      const averagePosition = new THREE.Vector3(0, 0, 0);
      for (let e of local) {
        averagePosition.add(e.Position);
      }
  
      averagePosition.multiplyScalar(1.0 / local.length);
  
      const directionToAveragePosition = averagePosition.clone().sub(
          this.Position);
      directionToAveragePosition.normalize();
      directionToAveragePosition.multiplyScalar(_BOID_FORCE_COHESION);
  
      // HACK: Floating point error from accumulation of positions.
      directionToAveragePosition.y = 0;
  
      return directionToAveragePosition;
    }
  
    _ApplySeek(destination) {
      const distance = Math.max(0,((
          this.Position.distanceTo(destination) - 50) / 2000)) ** 2;
      const direction = destination.clone().sub(this.Position);
      direction.normalize();
  
      const forceVector = direction.multiplyScalar(
          _BOID_FORCE_ORIGIN * distance);
      return forceVector;
    }
  }

  return {
    Agent: _Agent,
  };
})();
