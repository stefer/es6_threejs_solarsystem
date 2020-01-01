import { Sun, Planets } from "./SolarSystem.js";
import * as THREE from "./three.module.js";

class BodyBuilder {
    constructor(scale, options) {
        this._scale = scale || 1.0;
        this._scaleSun = options.scaleSun || 1.0;
        this._scalePlanets = options.scalePlanets || 1.0;
        this._scaleOrbits = options.scaleOrbits || 1.0;
        this._loader = new THREE.TextureLoader();
    }

    buildSun() {
        var geometry = new THREE.SphereBufferGeometry(Sun.radius * this._scale * this._scaleSun, 32, 32);
        var material = new THREE.MeshPhongMaterial();
        material.map = this._loader.load('../textures/2k_sun.jpg');
        var sunMesh = new THREE.Mesh(geometry, material);
        return sunMesh;
    }

    buildEarth() {
        return this.createPlanet(Planets.Earth, '../textures/2k_earth_daymap.jpg');
    }

    buildMars() {
        return this.createPlanet(Planets.Mars, '../textures/2k_mars.jpg');
    }

    buildPlanets() {
        return [
            ...this.createPlanet(Planets.Mercury, '../textures/2k_mercury.jpg'),
            ...this.createPlanet(Planets.Venus, '../textures/2k_venus_surface.jpg'),
            ...this.createPlanet(Planets.Earth, '../textures/2k_earth_daymap.jpg'),
            ...this.createPlanet(Planets.Mars, '../textures/2k_mars.jpg')
        ];
    }

    createPlanet(planet, textureUrl) {
        var bodies = [];
        var a = planet.semiAxis * this._scale * this._scaleOrbits;
        var b = a * (1.0 - planet.eccentricity);
        var c = a * planet.eccentricity;
        var curve = new THREE.EllipseCurve(c, 0, // ax, aY
            a, b, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            planet.inclination // aRotation
        );
        var points = curve.getPoints(50);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
        var ellipse = new THREE.Line(geometry, material);
        bodies.push(ellipse);
        var geometry1 = new THREE.SphereBufferGeometry(planet.radius * this._scale * this._scalePlanets, 32, 32);
        var material1 = new THREE.MeshPhongMaterial();
        material1.map = this._loader.load(textureUrl);
        var mesh = new THREE.Mesh(geometry1, material1);
        geometry1.translate(a + c, 0, 0);
        bodies.push(mesh);
        return bodies;
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