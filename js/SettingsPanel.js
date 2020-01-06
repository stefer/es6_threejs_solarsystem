import { GUI } from './dat.gui.module.js';

const Second = 1.0
const Minute = 60;
const Hour = 60 * Minute;
const Day = 86400.0 * Second;
const Week = 7 * Day;
const Year = 365.25636 * Day;
const Month = Year / 12.0;
const J2000 = new Date("2000-01-01");

class SettingsPanel {
    constructor(settings) {
        this.settings = settings;
        this.init();
    }

    init() {
        const panel = new GUI( { width: 310 } );

        const settings = {
            'Run': this.settings.run,
            '1 second equals': this.settings.timeScale,
            'Speed': 1,
            'Date' : fromTime(this.settings.time)
        }

        const folderSim = panel.addFolder( 'Simulation' );
        folderSim.add(this.settings, 'run' ).name("Run").onChange(vis => this.settings.run = vis );
        const speedChange = () => this.settings.timeScale = Number(settings['1 second equals']) * Number(settings['Speed']);
        folderSim.add(settings, '1 second equals', { 
                '1 second': Second,
                '1 minute': Minute,
                '1 hour': Hour, 
                '1 day': Day, 
                '1 week': Week, 
                '1 month': Month,  
                '1 year': Year})
            .onFinishChange(speedChange);
        folderSim.add(settings, 'Speed', -5, 5).onChange(speedChange);
        folderSim.add(settings, "Date").listen().onFinishChange(val => this.settings.time = toTime(val));
        folderSim.add(this.settings, 'follow', ["None", "Sun", "Earth"]).name("Follow");

        folderSim.open();

        requestAnimationFrame(() => this.update(settings));
    }

    update(settings) {
        settings.Date = fromTime(this.settings.time);
        requestAnimationFrame(() => this.update(settings));
    }
}

function fromTime(s) {
    const ms = s*1000 + J2000.getTime();
    const date = new Date(ms);
    return date.toISOString();
}

function toTime(dateString) {
    const date = new Date(dateString);
    const ms = date.getTime() - J2000.getTime();
    return ms/1000;
}

export {SettingsPanel}