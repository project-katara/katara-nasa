/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import 'worldwindjs'; //WorldWind global

/*global define, WorldWind */

/**
 * The USGSAstroGeologoy Layer
 * 
 * See: https://astrowebmaps.wr.usgs.gov/webmapatlas/Layers/maps.html
 */
export default class LakeATLASPntColorLayer extends WorldWind.WmsLayer {
  /**
   * Constructs a USGS WMS layer
   * @constructor
   * @augments WmsLayer
   */
  constructor() {
    let cfg = {
      title: 'LakeATLAS_v10_pnt',
      version: '1.3.0',
      service: 'http://104.248.127.100/geoserver/ows?',
      layerNames: 'ne:LakeATLAS_v10_pnt',
      sector: new WorldWind.Sector(-90.0, 90.0, -180, 180),
      levelZeroDelta: new WorldWind.Location(180, 180),
      numLevels: 15,
      format: 'image/png',
      size: 256,
      coordinateSystem: 'EPSG:4326', // optional
      styleNames: '', // (optional): {String} A comma separated list of the styles to include in this layer.</li>
    };
    super(cfg);

    // Make this layer opaque
    this.opacity = 1.0;

    this.urlBuilder.transparent = true;
  }
}