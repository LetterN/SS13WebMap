"use strict";
/**
 * SS13 webmap builder
 */
class SS13Webmap{
	constructor(config){
		if(!config){
			console.error("No configuration");
			return
		}else if(!config.maps.url){
			console.error("Config has NO url!");
			return null
		}
		this.loadcfg(config);
		this.init = false;
		this.buildMaps();
	}
	loadcfg(cfg){
		console.log(cfg)
		this.div_id = cfg.div_id || "webmap";
		this.zoom = cfg.zoom || [4,8];
		this.z_size = [[0,0],cfg.z_size] || [[0,0],[-255,255]];
		this.attrib = cfg.attrib || "${POLY_QUOTES_HERE}";
		
		this.mapUrl = cfg.maps.url || "http://localhost/debug";
		this.pipeUrl = cfg.maps.url_pipenet || "http://localhost/debug_pipes";
		this.mapcfg = cfg.maps || {};

		this.GPS = true;
	}
	buildMaps(){
		if(this.init == true){
			console.error("Map already built, canceled building");
			return
		}
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
		let a = this.buildTileLayer();
		console.log(a)
		L.control.layers(a.Station, a.pipenet).addTo(this.webmap);
		//L.tileLayer(this.mapUrl+"_1.png",{
		//	nativeZooms:this.zoom[0]
		//}).addTo(this.webmap)
		this.init = true;
	}
	buildTileLayer(){
		var tiles = {
			"Station":{},
			"pipenet":{}
		}
		for(let bonk=1; this.mapcfg.z_all >= bonk; bonk++){
			let metadat = this.mapcfg;
			let name_map = "Base Map";
			let name_pipe = "Pipenet";
			let layer_map = new L.tileLayer(metadat.url+"_"+bonk+".png",{nativeZooms:[this.zoom[0]]});
			let pipenet;

			/* initialize Z1 as per useal */
			if(bonk == 1){
				layer_map.addTo(this.webmap);
			}
			if("Name" in this.z_specificmeta(bonk)){
				name_map = this.z_specificmeta(bonk).Name;
			}else if(bonk > 1){
				name_map = "Deck "+bonk;
			}

			if("Pipe_Name" in this.z_specificmeta(bonk)){
				name_pipe = this.z_specificmeta(bonk).Pipe_Name;
			}else if(bonk > 1){
				name_pipe = "Pipenet "+bonk;
			}
			if("Pipenet" in this.z_specificmeta(bonk)){
				pipenet = new L.tileLayer(metadat.url_pipenet+"_"+bonk+".png",{nativeZooms:[this.zoom[0]]});
				tiles.pipenet[name_pipe] = pipenet;
			}
			tiles.Station[name_map] = layer_map;
		}
		return tiles
	}
	z_specificmeta(z){
		for(var i in this.mapcfg.z_meta){
			if(this.mapcfg.z_meta[i].Z == z){
				console.log(this.mapcfg.z_meta[i])
				return this.mapcfg.z_meta[i]
			}
		}
		return {}
	}
}