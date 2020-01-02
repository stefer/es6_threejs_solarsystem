import { Sun, Planets } from "./SolarSystem.js";
import * as THREE from "./three.module.js";

class Planet {
    constructor(container) {
        this.container = container;
    }
}

class BodyBuilder {
    constructor(scale, options) {
        this._scale = scale || 1.0;
        this._scaleSun = options.scaleSun || 1.0;
        this._scalePlanets = options.scalePlanets || 1.0;
        this._scaleOrbits = options.scaleOrbits || 1.0;
        this._loader = new THREE.TextureLoader();
    }

    buildSun() {
        var container = new THREE.Object3D();
        container.rotation.x = Math.PI/2;
        var geometry = new THREE.SphereBufferGeometry(Sun.radius * this._scale * this._scaleSun, 32, 32);
        var material = new THREE.MeshPhongMaterial();
        material.map = this._loader.load('../textures/2k_sun.jpg');
        var sunMesh = new THREE.Mesh(geometry, material);
        container.add(sunMesh);
        return container;
    }

    buildPlanets() {
        return Object.getOwnPropertyNames(Planets)
            .map(key => this.createPlanet(Planets[key]));
    }

    createPlanet(planet) {
        var a = planet.semiAxis * this._scale * this._scaleOrbits;
        var b = a * (1.0 - planet.eccentricity);
        var c = a * planet.eccentricity;

        var container = new THREE.Object3D();
        container.rotation.y = planet.inclination;

        var orbit = new THREE.Object3D();

        var rotationAxis = new THREE.Object3D();
        rotationAxis.position.set(a+c, 0.0, 0.0);
        rotationAxis.rotation.y = planet.obliquity;

        var curve = new THREE.EllipseCurve(c, 0, // ax, aY
            a, b, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            planet.inclination // aRotation
        );
        var points = curve.getPoints(150);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
        var ellipse = new THREE.Line(geometry, material);

        orbit.add(ellipse);

        var radius = planet.radius * this._scale * this._scalePlanets;
        var geometry1 = new THREE.SphereBufferGeometry(radius, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        material1.map = this._loader.load(planet.textureUrl);
        var mesh = new THREE.Mesh(geometry1, material1);
        
        var lineMaterial = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, -radius*1.3) );
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, radius*1.3) );
        var line = new THREE.Line( lineGeometry, lineMaterial );
        rotationAxis.add(line);

        var tilt = new THREE.Object3D();
        tilt.rotation.x = Math.PI/2;
        tilt.add(mesh);
        rotationAxis.add(tilt);
        orbit.add(rotationAxis);
        container.add(orbit);

        return new Planet(container);
    }

    createMoon(body) {
        var a = planet.semiAxis * this._scale * this._scaleOrbits;
        var b = a * (1.0 - planet.eccentricity);
        var c = a * planet.eccentricity;

        var container = new THREE.Object3D();
        container.rotation.y = planet.inclination;

        var orbit = new THREE.Object3D();

        var rotationAxis = new THREE.Object3D();
        rotationAxis.position.set(a+c, 0.0, 0.0);
        rotationAxis.rotation.y = planet.obliquity;

        var curve = new THREE.EllipseCurve(c, 0, // ax, aY
            a, b, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            planet.inclination // aRotation
        );
        var points = curve.getPoints(150);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
        var ellipse = new THREE.Line(geometry, material);

        orbit.add(ellipse);

        var radius = planet.radius * this._scale * this._scalePlanets;
        var geometry1 = new THREE.SphereBufferGeometry(radius, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        material1.map = this._loader.load(textureUrl);
        var mesh = new THREE.Mesh(geometry1, material1);
        
        var lineMaterial = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, -radius*1.3) );
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, radius*1.3) );
        var line = new THREE.Line( lineGeometry, lineMaterial );
        rotationAxis.add(line);

        var tilt = new THREE.Object3D();
        tilt.rotation.x = Math.PI/2;
        tilt.add(mesh);
        rotationAxis.add(tilt);
        orbit.add(rotationAxis);
        container.add(orbit);

        return new Planet(container);
    }

    createMarker(size, x, y, z)
    {
        var geometry1 = new THREE.SphereBufferGeometry(size, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        var mesh = new THREE.Mesh(geometry1, material1);
        geometry1.translate(x, y, z);
        return mesh;
    }
}

export { BodyBuilder }