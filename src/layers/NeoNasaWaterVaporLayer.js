/* eslint-disable no-unused-vars */
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
export default class NeoNasaWaterVaporLayer extends WorldWind.WmsLayer {
  /**
   * Constructs a USGS WMS layer
   * @constructor
   * @augments WmsLayer
   */
  constructor() {
    let cfg = {
      title: 'Water Vapor (46 hPa, Day, MLS, Aura)',
      version: '1.3.0',
      service: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?',
      layerNames: 'MLS_H2O_46hPa_Day',
      sector: new WorldWind.Sector(-90.0, 90.0, -180, 180),
      levelZeroDelta: new WorldWind.Location(180, 180),
      numLevels: 15,
      format: 'image/png',
      size: 256,
      // coordinateSystem: 'EPSG:4326', // optional
      styleNames: '', // (optional): {String} A comma separated list of the styles to include in this layer.</li>
    };
    super(cfg);

    // Make this layer opaque
    this.opacity = 1.0;

    this.urlBuilder.transparent = true;
  }
}


// Sea Surface Temperature (L3, Night, Annual, Mid Infrared, 4 km)
// MODIS_Aqua_L3_SST_MidIR_4km_Night_Annual

//https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/#visualization-product-catalog

//https://sedac.ciesin.columbia.edu/data/set/gpw-v4-land-water-area-rev11/maps/services#

//https://sedac.ciesin.columbia.edu/mapping/viewer/#