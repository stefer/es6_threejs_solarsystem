import { Sun, Planets } from "./SolarSystem.js";
import * as THREE from "./three.module.js";
import { CSS2DObject } from "./CSS2DRenderer.js";

class Planet {
    constructor(body, container) {
        this.body = body;
        this.container = container;
        this.moons = [];
    }

    get name() { return this.body.name }
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
        var radius = Sun.radius * this._scale * this._scaleSun;
        var geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
        var material = new THREE.MeshPhongMaterial();
        material.map = this._loader.load('../textures/2k_sun.jpg');
        var sunMesh = new THREE.Mesh(geometry, material);

        var label = this.createLabel(Sun.name, radius);

        container.add(sunMesh);
        container.add(label);
        return container;
    }

    buildPlanets() {
        return Object.getOwnPropertyNames(Planets)
            .map(key => this.createPlanet(Planets[key]));
    }

    createPlanet(body) {
        var a = body.semiAxis * this._scale * this._scaleOrbits;
        var b = a * (1.0 - body.eccentricity);
        var c = a * body.eccentricity;

        var container = this.object3D(body.name);
        container.rotation.x = body.inclination;
        const planet = new Planet(body, container);
        var orbit = this.object3D("orbit");

        var curve = new THREE.EllipseCurve(c, 0, // ax, aY
            a, b, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
        );
        var points = curve.getPoints(150);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color: body.color, opacity: 0.8 });
        var ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = Math.PI/2;

        orbit.add(ellipse);

        var radius = body.radius * this._scale * this._scalePlanets;
        var geometry1 = new THREE.SphereBufferGeometry(radius, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        material1.map = this._loader.load(body.textureUrl);
        var mesh = new THREE.Mesh(geometry1, material1);
        
        var lineMaterial = new THREE.LineBasicMaterial( { color: 0xeeeeee, linewidth: 5.0 } );
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, -radius*1.3, 0) );
        lineGeometry.vertices.push(new THREE.Vector3(0, radius*1.3, 0) );
        var line = new THREE.Line( lineGeometry, lineMaterial );

        var label = this.createLabel(body.name, radius);

        var center = this.object3D("center");
        center.position.set(a+c, 0.0, 0.0);
        var rotationAxis = this.object3D("axis");
        rotationAxis.rotation.y = body.obliquity;
        rotationAxis.add(line);
        center.add(rotationAxis);
        center.add( label );

        for (const moonDef of body.moons) {
            const moon = this.createPlanet(moonDef);
            planet.moons.push(moon);
            center.add(moon.container);
        }

        rotationAxis.add(mesh);
        orbit.add(center);
        container.add(orbit);

        return planet;
    }

    createMarker(size, x, y, z)
    {
        var geometry1 = new THREE.SphereBufferGeometry(size, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        var mesh = new THREE.Mesh(geometry1, material1);
        geometry1.translate(x, y, z);
        return mesh;
    }

    object3D(name) {
        var o3d = new THREE.Object3D();
        o3d.name = name;
        return o3d;
    }

    createLabel(name, radius) {
        var labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = name;
        labelDiv.style.marginTop = '-1em';
        var label = new CSS2DObject(labelDiv);
        label.position.set(0, radius, 0);
        return label;
    }
}

export { BodyBuilder }