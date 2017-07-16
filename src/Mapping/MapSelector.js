const Map = require('./Map/Map');
const execSync = require('child_process').execSync;
const Maps = require('./Map/Maps');

/**
 * Class RevisionMapSelector. Choose a mapping corresponding to current Pi revision
 *
 * @author Anthony Maudry <anthony.maudry@eye-dive.com>
 *
 * @license MIT
 */
class RevisionMapSelector {
    /**
     * Constructor
     */
    constructor() {
        const regexpRevision = /Revision\s+:\s+(.*)/;
        this._maps = {};
        this._revision = regexpRevision.exec(execSync('cat /proc/cpuinfo | grep Revision').toString().trim())[1].toLowerCase();
        this._loadRevisions();
    }

    /**
     * Get the mapping for current revision
     *
     * @returns {Map}
     */
    getMapForCurrentRevision() {
        if (this._maps.hasOwnProperty(this._revision)) {
            return this._maps[this._revision];
        }

        throw new Error(`Could not find correspondig map for revision ${revision}`);
    }

    /**
     * Adds a Map for a revision to the repository
     *
     * @param {string} revision
     * @param {Map} map
     * @param {boolean} force
     */
    addMapForRevision(revision, map, force) {
        revision = revision.toLowerCase();
        if (!map.hasOwnProperty('mapping')) {
            throw new Error(`${map.constructor.name} must implement the Map class`);
        }

        force = !!force;

        if (this._maps.hasOwnProperty(revision)
            && this._maps[revision].constructor.name !== map.constructor.name
            && !force) {
            throw new Error(`Revision ${revision} already have ${this._maps[revision].constructor.name} map`);
        }

        if (!this._maps.hasOwnProperty(revision)
            || this._maps[revision].constructor.name !== map.constructor.name
            || force) {
            this._maps[revision] = map;
        }
    }

    /**
     * Loads all the known revisions
     *
     * @private
     */
    _loadRevisions() {
        this.addMapForRevision('9000c1', Maps.PiZeroWMap);
        this.addMapForRevision('a02082', Maps.PiZeroWMap); // Pi Three Model B has the exact same GPIO Header
    }

    /**
     * Gets a singleton instance
     *
     * @returns {RevisionMapSelector}
     */
    static get instance() {
        if (!this._instance) {
            this._instance = new RevisionMapSelector();
        }

        return this._instance;
    }
}

module.exports = RevisionMapSelector;