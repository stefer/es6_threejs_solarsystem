import * as THREE from "./three.module.js";
//import { OrbitControls } from "./OrbitControls.js";
import "./camera-controls.js";
import { Sun } from "./SolarSystem.js";
import { BodyBuilder } from "./BodyBuilder.js";
import { CSS2DRenderer } from "./CSS2DRenderer.js";

const Scale = 1.0/Sun.radius;

class SolarSystemSettings {
    constructor() {
        this.scale = 1.0/Sun.radius;
        this.run = false;
        this.time = 0;
        this.timeScale = 24 * 60 * 60;
        this.follow = "None";
    }
}

class SolarSystemScene {
    constructor(canvas, labelElement, settings) {
        this.settings = settings;
        this.canvas = canvas;
        this.init();
        labelElement.appendChild(this.labelRenderer.domElement);
    }

    update(deltaSec, totalSec) {
        this.updateSettings();

        this.controls.update(deltaSec);

        if (this.settings.run) {
            this.settings.time += deltaSec * this.settings.timeScale;
        }

        this.sun.update(this.settings.time);
        this.planets.forEach(planet => planet.update(this.settings.time));

        if (this.follow && this.settings.run) {
            const tPos = this.follow.position;
            const deltaMove = tPos.clone().sub(this.followLastPos);
            const pos = this.controls.getPosition().clone();
            pos.add(deltaMove);
            this.controls.setPosition(pos.x, pos.y, pos.z, false);
            this.controls.setLookAt( pos.x, pos.y, pos.z, tPos.x, tPos.y, tPos.z, false );
            this.followLastPos = tPos.clone();
        } 
    }

    render() {
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render( this.sunScene, this.camera );
        this.renderer.render( this.scene, this.camera );
        this.labelRenderer.render( this.scene, this.camera );
        this.labelRenderer.render( this.sunScene, this.camera );
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize( canvas.clientWidth, canvas.clientHeight );
        this.renderer.antialias = true;

        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize( canvas.clientWidth, canvas.clientHeight );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer = labelRenderer;

        this.sunScene	= new THREE.Scene(); // Use a separate scene for sun and ambient light to make it shine
        this.scene	= new THREE.Scene();

        this.initControls();
        this.initLights();
        this.initWorld();
    }

    initControls() {
        this.axisHelper = new THREE.AxesHelper( 100 );
        this.scene.add(this.axisHelper);

        this.camera	= new THREE.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 0.001, 5000 );
        this.camera.position.set(-30, 10, 10);

        // let controls = new OrbitControls( this.camera, this.renderer.domElement );

        CameraControls.install( { THREE: THREE } );
        let controls = new CameraControls( this.camera, this.renderer.domElement );
        controls.verticalDragToForward = true;
        controls.dollyToCursor = true;

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minPolarAngle = -Math.PI;
        controls.maxPolarAngle = Math.PI*2;
        this.controls = controls;
    }

    initLights() {
        // A bright ambient light for the sun
        var light	= new THREE.AmbientLight( 0x888888, 3 )
        this.sunScene.add(light)

        // A point light at the center of the sun
        var pointLight = new THREE.PointLight( 0xffffff, 2, 500, 1);
        pointLight.position.set( 0, 0, 0 );
        this.scene.add( pointLight );
        var pointLightHelper = new THREE.PointLightHelper( pointLight, Sun.radius * Scale );
        this.scene.add( pointLightHelper );

        // A dim ambient light for all planets
        var light = new THREE.AmbientLight( 0x888888, 0.2 )
        this.scene.add(light)
    }

    initWorld() {
        let builder = new BodyBuilder(this.settings.scale, {scaleSun: 1.0, scalePlanets: 1.0, scaleOrbits: 1 });

        this.sun = builder.buildSun()
        this.sunScene.add(this.sun.container);
        this.sunScene.add(builder.buildStarfield());

        this.planets = builder.buildPlanets();

        this.planets.forEach(planet => {this.scene.add(planet.container);});
    }

    updateSettings() {
        const runState = this.settings.run;
        this.settings.run = false;
        if (this.settings.follow && this.settings.follow != "None") {
            if (this.follow == null || this.follow.name.toLowerCase() != this.settings.follow.toLowerCase()) {
                const planet = this.planets.find(p => p.name.toLowerCase() == this.settings.follow.toLowerCase()) || this.sun;
                this.follow = planet;
                this.followLastPos = planet.position.clone();
                const pos = planet.position;
                const dist = planet.body.radius * this.settings.scale * 4
                this.controls.setLookAt( pos.x - dist, pos.y + 2*dist, pos.z - dist, pos.x, pos.y, pos.z, true );
            }
        }
        else {
            this.follow = null;
            this.followLastPos = null;
        }
        this.settings.run = runState;
    }
}

export {SolarSystemScene, SolarSystemSettings}