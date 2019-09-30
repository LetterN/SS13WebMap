"use strict";
/**
 * SS13 webmap builder
 */
class SS13Webmap{
	constructor(config){
		if(!config.maps.url){
			console.error("Config has NO url!");
			return null
		}
		this.loadcfg(config);
		this.init = false;
		this.buildMaps();
	}
	loadcfg(cfg){
		this.div_id = cfg.div_id || "webmap";
		this.zoom = cfg.zoom || [0,0];
		this.z_size = [[0,0],cfg.z_size] || [[0,0],[-255,255]];
		this.attrib = cfg.attrib || "${POLY_QUOTES_HERE}";
		
		this.mapUrl = cfg.maps.url || "http://localhost/debug";
		this.pipeUrl = cfg.maps.url_pipenet || "http://localhost/debug_pipes";
		this.mapcfg = cfg.maps || {};

		this.GPS = true;
	}
	buildMaps(){
		if(this.init == true){console.error("Map already built, canceled building");return}
		this.webmap = new L.map(this.div_id, {
			"minZoom":this.zoom[0], "maxZoom":this.zoom[1],
			"zoom": this.zoom[0], 
			"center": [this.z_size[1][0]/2, this.z_size[1][1]/2], 
            "crs": L.CRS.Simple
		});
		this.webmap.attributionControl.setPrefix(this.attrib);
		this.webmap.fitBounds(this.z_size);
		this.webmap.setMaxBounds(this.z_size);
		attachListener(this.webmap, this.z_size);
		
		L.tileLayer(this.mapUrl+"_1.png",{
			nativeZooms:[this.zoom[0]]
		}).addTo(this.webmap)
		this.init = true;
	}
	buildTileLayer(){
		var tiles = {
			"Station":{},
			"Pipenet":{}
		}

		for(let bonk=0; this.mapcfg.z_all <= bonk; bonk++){
			let metadat = findMetadat(bonk);

		}

		return tiles
	}
	findMetadat(z){
		for(bonks in this.mapcfg.z_meta){
			let bonk = this.mapcfg.z_meta[bonks]
			if(bonk.Z == z){
				return bonk
			}
		}
		return {}
	}
	set GPS(valu){
		this.cords = valu;
	}
	get GPS(){
		return this.cords 
	}
}