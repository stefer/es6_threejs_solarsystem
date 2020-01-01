class Body 
{
    // Distances in km, angles in radians
    constructor(name, options) {
        this._name = name || "Unknown";
        this._radius = options.radius || 0;
        this._semiAxis = options.semiAxis || 0;
        this._eccentricity = options.eccentricity || 0;
        this._inclination = options.inclination || 0;
    }

    get name() { return this._name }
    get radius() { return this._radius }
    get semiAxis() { return this._semiAxis }
    get eccentricity() { return this._eccentricity }
    get inclination() { return this._inclination }
}

const Au = 149597870.700;

const Planets = {
    Mercury: new Body("mercury", {
        radius : 2440.0,
        semiAxis : 3.870969082975600E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 7.003786336671616E+00 * Math.PI / 180.0
        
    }),
    Venus: new Body("venus", {
        radius : 6051.893,
        semiAxis : 7.233255509230662E-01 * Au,
        eccentricity : 6.745659520687819E-03,
        inclination : 2.056509926968355E-01 * Math.PI / 180.0
        
    }),
    Earth: new Body("earth", {
        radius : 6356.752,
        semiAxis : 1 * Au,
        eccentricity : 1.718269673643725E-02,
        inclination : 2.885482133031596E-03 * Math.PI / 180.0
    }),
    Mars: new Body("mars", {
        radius : 3396.19,
        semiAxis : 1.523655695334521E+00 * Au,
        eccentricity : 9.349419467092489E-02,
        inclination : 1.848032821343787E+00 * Math.PI / 180.0
    })
}

const Sun = new Body ("sun", {radius : 696000.0 })


export {Planets, Sun, Au}