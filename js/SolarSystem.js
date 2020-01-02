class Body 
{
    // Distances in km, angles in radians
    constructor(name, options) {
        this._name = name || "Unknown";
        this._radius = options.radius || 0;
        this._semiAxis = options.semiAxis || 0;
        this._eccentricity = options.eccentricity || 0;
        this._inclination = options.inclination || 0;
        this._obliquity = options.obliquity || 0;
        this._textureUrl = options.textureUrl || null;
        this._moons = options.moons || [];
    }

    get name() { return this._name }
    get radius() { return this._radius }
    get semiAxis() { return this._semiAxis }
    get eccentricity() { return this._eccentricity }
    get inclination() { return this._inclination }
    get obliquity() { return this._obliquity }
    get textureUrl() { return this._textureUrl }
    get moons() { return this._moons }
}

const Au = 149597870.700;

const Planets = {
    Mercury: new Body("mercury", {
        radius : 2440.0,
        semiAxis : 3.870969082975600E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 7.003786336671616E+00 * Math.PI / 180.0, 
        textureUrl: '../textures/2k_mercury.jpg'
        
    }),
    Venus: new Body("venus", {
        radius : 6051.893,
        semiAxis : 7.233255509230662E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 2.056509926968355E-01 * Math.PI / 180.0,
        textureUrl: '../textures/2k_venus_surface.jpg'
        
    }),
    Earth: new Body("earth", {
        radius : 6356.752,
        semiAxis : 1 * Au,
        eccentricity : 1.718269673643725E-02,
        inclination : 2.885482133031596E-03 * Math.PI / 180.0,
        obliquity : 23.4392911 * Math.PI / 180.0, 
        textureUrl: '../textures/2k_earth_daymap.jpg',
        moons : [
            new Body ("moon", {
                radius : 1737.4,
                semiAxis : 0.00257 * Au,
                eccentricity : 0.0549,
                inclination : 5.145 * Math.PI / 180.0,
                obliquity : 6.687 * Math.PI / 180.0,
                textureUrl: '../textures/2k_mercury.jpg'
            })
        ]
    }),
    Mars: new Body("mars", {
        radius : 3396.19,
        semiAxis : 1.523655695334521E+00 * Au,
        eccentricity : 9.349419467092489E-02,
        inclination : 1.848032821343787E+00 * Math.PI / 180.0,
        textureUrl: '../textures/2k_mars.jpg'
    })
}

const Sun = new Body ("sun", {radius : 696000.0 })


export {Planets, Sun, Au}