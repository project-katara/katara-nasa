/*
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import "worldwindjs"; //WorldWind global

/*global define, WorldWind */

/**
 * The USGSAstroGeologoy Layer
 *
 * See: https://astrowebmaps.wr.usgs.gov/webmapatlas/Layers/maps.html
 */
export default class WaterColorLayer extends WorldWind.WmsLayer {
  /**
   * Constructs a USGS WMS layer
   * @constructor
   * @augments WmsLayer
   */
  constructor() {
    let cfg = {
      title: 'HydroLAKES_points_v10',
      version: '1.3.0',
      service: 'https://maps.katara.earth/geoserver/ows?',
      layerNames: 'ne:HydroLAKES_polys_v10',
      sector: new WorldWind.Sector(-90.0, 90.0, -180, 180),
      levelZeroDelta: new WorldWind.Location(180, 180),
      numLevels: 15,
      format: 'image/png',
      size: 128,
      coordinateSystem: 'EPSG:4326', // optional
      styleNames: '', // (optional): {String} A comma separated list of the styles to include in this layer.</li>
    };
    super(cfg);

    // Make this layer opaque
    this.opacity = 1.0;

    this.urlBuilder.transparent = true;
  }
}
