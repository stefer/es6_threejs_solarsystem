import { Sun as SunDef, Planets } from "./SolarSystem.js";
import * as THREE from "./three.module.js";
import { CSS2DObject } from "./CSS2DRenderer.js";

class Sun {
    constructor(body, container) {
        this.body = body;
        this.container = container;
    }

    get name() { return this.body.name }

    update(time) {
        let period = this.body.rotationPeriod
        let rotProgress = (time % period) / period;
        let rotation = rotProgress * 2 * Math.PI;
        this.container.rotation.y = rotation;
    }
}

class Planet {
    constructor(body, container, rotationAxis, curve, center) {
        this.body = body;
        this.container = container;
        this.curve = curve;
        this.center = center;
        this.rotationAxis = rotationAxis;
        this.moons = [];
    }

    get name() { return this.body.name }

    update(time) {
        let period = this.body.rotationPeriod
        let rotProgress = (time % period) / period;
        let rotation = rotProgress * 2 * Math.PI;
        this.rotationAxis.rotation.y = rotation;

        period = this.body.orbitPeriod;
        rotProgress = (time % period) / period;
        const pos = this.curve.getPoint(rotProgress);
        this.center.position.set(pos.x, 0, -pos.y);

        for (const moon of this.moons) {
            moon.update(time);
        }
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
        const container = new THREE.Object3D();
        const radius = SunDef.radius * this._scale * this._scaleSun;
        const geometry = new THREE.SphereBufferGeometry(radius, 64, 64);
        const material = new THREE.MeshPhongMaterial();
        material.map = this._loader.load('../textures/2k_sun.jpg');
        const sunMesh = new THREE.Mesh(geometry, material);

        const label = this.createLabel(SunDef.name, radius);

        container.add(sunMesh);
        container.add(label);
        let sun = new Sun(SunDef, container);
        return sun;
    }

    buildStarfield() {
        // create the geometry sphere
        const geometry  = new THREE.SphereGeometry(2000, 64, 64)
        // create the material, using a texture of startfield
        const material  = new THREE.MeshBasicMaterial()
        material.map   = THREE.ImageUtils.loadTexture('../textures/8k_stars_milky_way.jpg')
        material.side  = THREE.BackSide
        // create the mesh based on geometry and material
        const mesh  = new THREE.Mesh(geometry, material);
        return mesh;
    }

    buildPlanets() {
        return Object.getOwnPropertyNames(Planets)
            .map(key => this.createPlanet(Planets[key]));
    }

    createPlanet(body) {
        const a = body.semiAxis * this._scale * this._scaleOrbits;
        const b = a * (1.0 - body.eccentricity);
        const c = a * body.eccentricity;

        const container = this.object3D(body.name);
        container.rotation.x = body.inclination;
        const orbit = this.object3D("orbit");

        const curve = new THREE.EllipseCurve(c, 0, // ax, aY
            a, b, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
        );
        const points = curve.getPoints(720);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: body.color, opacity: 0.8 });
        const ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x = Math.PI/2;


        const radius = body.radius * this._scale * this._scalePlanets;
        const geometry1 = new THREE.SphereBufferGeometry(radius, 64, 64);
        const material1 = new THREE.MeshPhongMaterial();
        material1.map = this._loader.load(body.textureUrl);
        const mesh = new THREE.Mesh(geometry1, material1);
        
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0xeeeeee, linewidth: 5.0 } );
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, -radius*1.3, 0) );
        lineGeometry.vertices.push(new THREE.Vector3(0, radius*1.3, 0) );
        const line = new THREE.Line( lineGeometry, lineMaterial );

        const label = this.createLabel(body.name, radius);

        const globe = this.object3D("globe");
        const center = this.object3D("center");
        center.position.set(a+c, 0.0, 0.0);
        const rotationAxis = this.object3D("axis");
        rotationAxis.rotation.z = body.obliquity;

        rotationAxis.add(line);
        center.add(rotationAxis);
        center.add( label );

        globe.add(mesh);
        rotationAxis.add(globe);
        orbit.add(center);
        orbit.add(ellipse);
        container.add(orbit);

        const planet = new Planet(body, container, globe, curve, center);

        for (const moonDef of body.moons) {
            const moon = this.createPlanet(moonDef);
            planet.moons.push(moon);
            center.add(moon.container);
        }

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