/**
 * FreePointerLockControls
 * Bản sửa của PointerLockControls (bỏ clamp pitch)
 * Dùng cho three.js phiên bản cũ (dạng function)
 */

import {
    Euler,
    EventDispatcher,
    Vector3
} from "https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js"; // chỉnh lại path theo project của bạn

var FreePointerLockControls = function (camera, domElement) {

    if (domElement === undefined) {
        console.warn('THREE.FreePointerLockControls: The second parameter "domElement" is now mandatory.');
        domElement = document.body;
    }

    this.domElement = domElement;
    this.isLocked = false;

    //
    // internals
    //

    var scope = this;

    var changeEvent = { type: 'change' };
    var lockEvent = { type: 'lock' };
    var unlockEvent = { type: 'unlock' };

    var euler = new Euler(0, 0, 0, 'YXZ');

    var vec = new Vector3();

    function onMouseMove(event) {

        if (scope.isLocked === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        euler.setFromQuaternion(camera.quaternion);

        euler.y -= movementX * 0.002;
        euler.x -= movementY * 0.002;

        // ❌ Bỏ clamp:
        // euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

        camera.quaternion.setFromEuler(euler);

        scope.dispatchEvent(changeEvent);

    }

    function onPointerlockChange() {
        if (document.pointerLockElement === scope.domElement) {
            scope.dispatchEvent(lockEvent);
            scope.isLocked = true;
        } else {
            scope.dispatchEvent(unlockEvent);
            scope.isLocked = false;
        }
    }

    function onPointerlockError() {
        console.error('THREE.FreePointerLockControls: Unable to use Pointer Lock API');
    }

    this.connect = function () {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('pointerlockchange', onPointerlockChange, false);
        document.addEventListener('pointerlockerror', onPointerlockError, false);
    };

    this.disconnect = function () {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('pointerlockchange', onPointerlockChange, false);
        document.removeEventListener('pointerlockerror', onPointerlockError, false);
    };

    this.dispose = function () {
        this.disconnect();
    };

    this.getObject = function () { // retaining this method for backward compatibility
        return camera;
    };

    this.getDirection = (function () {
        var direction = new Vector3(0, 0, -1);
        return function (v) {
            return v.copy(direction).applyQuaternion(camera.quaternion);
        };
    }());

    this.moveForward = function (distance) {
        vec.setFromMatrixColumn(camera.matrix, 0);
        vec.crossVectors(camera.up, vec);
        camera.position.addScaledVector(vec, distance);
    };

    this.moveRight = function (distance) {
        vec.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(vec, distance);
    };

    this.lock = function () {
        this.domElement.requestPointerLock();
    };

    this.unlock = function () {
        document.exitPointerLock();
    };

    this.connect();
};

FreePointerLockControls.prototype = Object.create(EventDispatcher.prototype);
FreePointerLockControls.prototype.constructor = FreePointerLockControls;

export { FreePointerLockControls };
