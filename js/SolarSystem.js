class Body 
{
    // Distances in km, angles in radians, time in seconds since J2000
    constructor(name, options) {
        this._name = name || "Unknown";
        this._radius = options.radius || 0;
        this._semiAxis = options.semiAxis || 0;
        this._eccentricity = options.eccentricity || 0;
        this._inclination = options.inclination || 0;
        this._obliquity = options.obliquity || 0;
        this._orbitPeriod = options.orbitPeriod || 0;
        this._rotationPeriod = options.rotationPeriod || 0;
        this._textureUrl = options.textureUrl || null;
        this._moons = options.moons || [];
        this._color = options.color || 0xcccccc
    }

    get name() { return this._name }
    get radius() { return this._radius }
    get semiAxis() { return this._semiAxis }
    get eccentricity() { return this._eccentricity }
    get inclination() { return this._inclination }
    get obliquity() { return this._obliquity }
    get orbitPeriod() { return this._orbitPeriod }
    get rotationPeriod() { return this._rotationPeriod }
    get textureUrl() { return this._textureUrl }
    get moons() { return this._moons }
    get color() { return this._color }
}

const Au = 149597870.700;
const Second = 1.0
const Day = 86400.0 * Second;
const Week = 7 * Day;
const Year = 365.25636 * Day;
const Month = Year / 12.0;

const Planets = {
    Mercury: new Body("mercury", {
        radius : 2440.0,
        semiAxis : 3.870969082975600E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 7.003786336671616E+00 * Math.PI / 180.0,
        orbitPeriod : 87.9691 * Day,
        rotationPeriod: 58.646 * Day,
        textureUrl: '../textures/2k_mercury.jpg',
        color: 0xcccccc
        
    }),
    Venus: new Body("venus", {
        radius : 6051.893,
        semiAxis : 7.233255509230662E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 2.056509926968355E-01 * Math.PI / 180.0,
        orbitPeriod : 225 * Day,
        rotationPeriod: -243.0187 * Day,
        textureUrl: '../textures/2k_venus_surface.jpg',
        color: 0xdd7711
    }),
    Earth: new Body("earth", {
        radius : 6356.752,
        semiAxis : 1 * Au,
        eccentricity : 1.718269673643725E-02,
        inclination : 2.885482133031596E-03 * Math.PI / 180.0,
        obliquity : 23.4392911 * Math.PI / 180.0, 
        orbitPeriod : 1 * Year,
        rotationPeriod: 0.99726968 * Day,
        textureUrl: '../textures/2k_earth_daymap.jpg',
        color: 0x0870a8,
        moons : [
            new Body ("moon", {
                radius : 1737.4,
                semiAxis : 0.00257 * Au,
                eccentricity : 0.0549,
                inclination : 5.145 * Math.PI / 180.0,
                orbitPeriod : 27.32 * Day,
                rotationPeriod: 27.321661 * Day,
                obliquity : 6.687 * Math.PI / 180.0,
                textureUrl: '../textures/2k_moon.jpg',
                color: 0x4870a8,
            })
        ]
    }),
    Mars: new Body("mars", {
        radius : 3396.19,
        semiAxis : 1.523655695334521E+00 * Au,
        eccentricity : 9.349419467092489E-02,
        inclination : 1.848032821343787E+00 * Math.PI / 180.0,
        orbitPeriod : 1.881 * Year,
        rotationPeriod: 1.02595675 * Day,
        textureUrl: '../textures/2k_mars.jpg',
        color: 0xe64a07
    })

    /*
    Jupiter: new Body("jupiter", {
        radius : ??,
        semiAxis : ??,
        eccentricity : ??,
        inclination : ?? * Math.PI / 180.0,
        orbitPeriod : 11.86 * Year,
        rotationPeriod: 0.41007 * Day,
        textureUrl: '../textures/2k_jupiter.jpg',
        color: 0xe64a07
    }),
    Saturn: new Body("saturn", {
        radius : ??,
        semiAxis : ??,
        eccentricity : ??,
        inclination : ?? * Math.PI / 180.0,
        orbitPeriod : 29.46 * Year,
        rotationPeriod: 0.426 days * Day,
        textureUrl: '../textures/2k_saturn.jpg',
        color: 0xe64a07
    }),
    Uranus: new Body("uranus", {
        radius : ??,
        semiAxis : ??,
        eccentricity : ??,
        inclination : ?? * Math.PI / 180.0,
        orbitPeriod : 84.0205 * Year,
        rotationPeriod: −0.71833 * Day,
        textureUrl: '../textures/2k_uranus.jpg',
        color: 0xe64a07
    }),
    Neptune: new Body("neptune", {
        radius : ??,
        semiAxis : ??,
        eccentricity : ??,
        inclination : ?? * Math.PI / 180.0,
        orbitPeriod : 164.8 * Year,
        rotationPeriod: 0.67125 * Day,
        textureUrl: '../textures/2k_uranus.jpg',
        color: 0xe64a07
    }),
    Pluto: new Body("pluto", {
        radius : ??,
        semiAxis : ??,
        eccentricity : ??,
        inclination : ?? * Math.PI / 180.0,
        orbitPeriod : 248.1 * Year,
        rotationPeriod: −6.38718 * Day,
        textureUrl: '../textures/2k_neptune.jpg',
        color: 0xe64a07
    }),

    */
}

const Sun = new Body ("sun", 
{
    radius : 696000.0,
    rotationPeriod: 25.379995 * Day,
})


export {Planets, Sun, Au}