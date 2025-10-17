// Main script for Pat'rouille refonte
// Dependencies: Leaflet, Leaflet-Geoman
(function () {

// --- Config ---
const DEFAULT_CENTER = [45.214659,5.846747];
const DEFAULT_ZOOM = 12;
const IGN_API_KEY = "ta-cle-api"; // remplace avec ta clé IGN si disponible

// --- DOM ---
const mapEl = document.getElementById('map');
const coordInput = document.getElementById('cord');
const depInput = document.getElementById('dep');
const communeInput = document.getElementById('commune');
const geojsonInput = document.getElementById('geojson');
const fileInput = document.getElementById('fileInput');
const colorControlContainer = document.getElementById('color-control');

// --- Map init ---
const map = L.map(mapEl, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    fullscreenControl: false
});

// Base OSM
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example IGN WMTS (placeholder) - requires API key for actual tiles
const wmtsUrl = "https://wxs.ign.fr/" + IGN_API_KEY + "/geoportail/wmts";
const ign = L.tileLayer(wmtsUrl + "?layer=GEOGRAPHICALGRIDSYSTEMS.MAPS&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&tilematrix={z}&tilerow={y}&tilecol={x}", {
    maxZoom: 18,
    attribution: "© IGN - clé requise"
});

// Layer control
const baseMaps = { "OSM": osm, "IGN (clé requise)": ign };
L.control.layers(baseMaps).addTo(map);

// Geoman controls
map.pm.addControls({
    position: 'topright',
    drawCircle: true,
    drawMarker: true,
    drawPolygon: true,
    drawPolyline: true,
    drawRectangle: true,
    cutPolygon: true,
    editMode: true,
    dragMode: true,
    removalMode: true
});

// keep track of last drawn layer for styling
map.on('pm:create', function (e) {
    const layer = e.layer;
    layer._drawnByGeoman = true;
    if (currentColor) {
        if (layer.setStyle) layer.setStyle({ color: currentColor, fillColor: currentColor });
    }
});

// --- Color Picker Control ---
let currentColor = "#3388ff";
function createColorControl() {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = currentColor;
    input.title = 'Choisir une couleur';
    input.addEventListener('input', (e) => {
        currentColor = e.target.value;
        // apply to selected layers if any
        if (selectedLayer && selectedLayer.setStyle) {
            selectedLayer.setStyle({ color: currentColor, fillColor: currentColor });
        }
    });
    colorControlContainer.appendChild(input);
}
createColorControl();

let selectedLayer = null;
map.on('pm:edit', e => {
    // placeholder
});
map.on('click', (e) => {
    // If coord input is focused, write coords
    if (document.activeElement === coordInput) {
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);
        coordInput.value = `${lat}, ${lng}`;
    }
});

// Click on layer to select & change color
map.on('pm:create', function (e) {
    const layer = e.layer;
    layer.on('click', function () {
        selectedLayer = this;
        if (selectedLayer.setStyle) selectedLayer.setStyle({ color: currentColor, fillColor: currentColor });
    });
});

// --- Geocoding communes ---
function loadDepartements() {
    fetch('https://geo.api.gouv.fr/departements')
        .then(r => r.json())
        .then(data => {
            const dl = document.getElementById('dep_list');
            data.forEach(d => {
                const opt = document.createElement('option');
                opt.value = `${d.code} - ${d.nom}`;
                dl.appendChild(opt);
            });
        }).catch(err => console.error(err));
}
loadDepartements();

communeInput.addEventListener('change', function () {
    const communeName = communeInput.value.trim();
    if (!communeName) return;
    // department code from dep input start (ex "38 - Isère")
    const depCode = (depInput.value || '').split(' ')[0];
    fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(communeName)}&fields=nom,code,centre&boost=population`)
        .then(r => r.json())
        .then(communes => {
            const filtered = communes.filter(c => {
                const codeStart = c.code.slice(0, depCode.length || 2);
                return (depCode ? codeStart === depCode : true) && c.nom.toLowerCase() === communeName.toLowerCase();
            });
            if (filtered.length === 1) {
                const c = filtered[0];
                const [lng, lat] = c.centre.coordinates;
                map.setView([lat, lng], 14);
            } else if (filtered.length > 1) {
                alert('Plusieurs communes trouvées, affinez la recherche.');
            } else {
                alert('Aucune commune exacte trouvée dans ce département.');
            }
        }).catch(err => console.error(err));
});

// --- Coordinate conversions (DD <-> DMS <-> DMD) ---
function ddToDms(deg) {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d - m/60) * 3600).toFixed(2);
    return [d,m,s];
}
function ddToDmd(deg) {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = ((abs - d) * 60).toFixed(3);
    return [d,m];
}
function dmsToDd(d,m,s,ref) {
    if(d===""||m===""||s==="") return NaN;
    let dd = parseFloat(d) + parseFloat(m)/60 + parseFloat(s)/3600;
    if(ref==="S"||ref==="W") dd*=-1;
    return dd;
}
function dmdToDd(d,m,ref) {
    if(d===""||m==="") return NaN;
    let dd = parseFloat(d) + parseFloat(m)/60;
    if(ref==="S"||ref==="W") dd*=-1;
    return dd;
}

// DOM refs for converter
const latDD=document.getElementById('latDD'), lonDD=document.getElementById('lonDD');
const latD=document.getElementById('latD'), latM=document.getElementById('latM'), latS=document.getElementById('latS'), latRef=document.getElementById('latRef');
const lonD=document.getElementById('lonD'), lonM=document.getElementById('lonM'), lonS=document.getElementById('lonS'), lonRef=document.getElementById('lonRef');
const latDmdD=document.getElementById('latDmdD'), latDmdM=document.getElementById('latDmdM'), latDmdRef=document.getElementById('latDmdRef');
const lonDmdD=document.getElementById('lonDmdD'), lonDmdM=document.getElementById('lonDmdM'), lonDmdRef=document.getElementById('lonDmdRef');

function updateAllFromDD(lat,lon){
    if(isNaN(lat)||isNaN(lon)) return;
    const [d1,m1,s1]=ddToDms(lat), [d2,m2,s2]=ddToDms(lon);
    latD.value=d1; latM.value=m1; latS.value=s1; latRef.value=lat>=0?'N':'S';
    lonD.value=d2; lonM.value=m2; lonS.value=s2; lonRef.value=lon>=0?'E':'W';
    const [dd1,mm1]=ddToDmd(lat), [dd2,mm2]=ddToDmd(lon);
    latDmdD.value=dd1; latDmdM.value=mm1; latDmdRef.value=lat>=0?'N':'S';
    lonDmdD.value=dd2; lonDmdM.value=mm2; lonDmdRef.value=lon>=0?'E':'W';
}
latDD.addEventListener('input', ()=>{ const lat=parseFloat(latDD.value); const lon=parseFloat(lonDD.value); if(!isNaN(lat)&&!isNaN(lon)) updateAllFromDD(lat,lon); });
lonDD.addEventListener('input', ()=>{ const lat=parseFloat(latDD.value); const lon=parseFloat(lonDD.value); if(!isNaN(lat)&&!isNaN(lon)) updateAllFromDD(lat,lon); });

[latD,latM,latS,latRef,lonD,lonM,lonS,lonRef].forEach(el=>el?.addEventListener('input', ()=>{
    const lat=dmsToDd(latD.value,latM.value,latS.value,latRef.value);
    const lon=dmsToDd(lonD.value,lonM.value,lonS.value,lonRef.value);
    if(isNaN(lat)||isNaN(lon)) return;
    latDD.value=lat.toFixed(6); lonDD.value=lon.toFixed(6); updateAllFromDD(lat,lon);
}));

[latDmdD,latDmdM,latDmdRef,lonDmdD,lonDmdM,lonDmdRef].forEach(el=>el?.addEventListener('input', ()=>{
    const lat=dmdToDd(latDmdD.value,latDmdM.value,latDmdRef.value);
    const lon=dmdToDd(lonDmdD.value,lonDmdM.value,lonDmdRef.value);
    if(isNaN(lat)||isNaN(lon)) return;
    latDD.value=lat.toFixed(6); lonDD.value=lon.toFixed(6); updateAllFromDD(lat,lon);
}));

// --- centercordonnee ---
function centercordonnee(){
    const val = coordInput.value;
    if(!val) return console.error("Input vide");
    const parts = val.split(',');
    if(parts.length!==2) return console.error("Format incorrect");
    const lat = parseFloat(parts[0].trim()), lng = parseFloat(parts[1].trim());
    if(isNaN(lat)||isNaN(lng)) return console.error("Coord invalides");
    L.marker([lat,lng]).addTo(map);
    map.setView([lat,lng],14);
}

// --- Form Save / Load local ---
function saveLocal(){
    const formData = collectForm();
    // include GeoMan layers
    const geojson = exportGeomanLayers();
    formData.geojson = geojson;
    localStorage.setItem('pat_alerte', JSON.stringify(formData));
    alert("Sauvegardé en local");
}

function loadLocal(){
    const raw = localStorage.getItem('pat_alerte');
    if(!raw) return alert("Aucune sauvegarde locale");
    const data = JSON.parse(raw);
    fillForm(data);
    if(data.geojson) {
        geojsonInput.value = JSON.stringify(data.geojson);
        L.geoJSON(data.geojson).addTo(map);
    }
    alert("Chargé depuis local");
}

function collectForm(){
    const form = document.getElementById('alerteForm');
    const out = {};
    new FormData(form).forEach((v,k)=> out[k]=v);
    return out;
}

function fillForm(data){
    Object.keys(data).forEach(k=>{
        const el = document.getElementsByName(k)[0] || document.getElementById(k);
        if(el){
            if(el.tagName==='INPUT' || el.tagName==='TEXTAREA' || el.tagName==='SELECT') el.value = data[k];
        }
    });
}

// --- Download plain text ---
function downloadTxt(){
    const d = collectForm();
    const geo = exportGeomanLayers();
    d.geojson = geo;
    let content = `PRISE D'ALERTE\n`;
    Object.keys(d).forEach(k=>{ if(k!=='geojson') content += `${k}: ${d[k]}\n`; });
    const blob = new Blob([content], {type: 'text/plain'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'prise_alerte.txt'; link.click();
}

// --- Upload file (text) ---
function uploadFile(){
    const f = fileInput.files[0];
    if(!f) return alert('Choisir un fichier .txt');
    const r = new FileReader();
    r.onload = e => {
        const content = e.target.result;
        const data = parseTextFile(content);
        fillForm(data);
    };
    r.readAsText(f);
}

function parseTextFile(content){
    const lines = content.split('\n');
    const data = {};
    lines.forEach(line=>{
        if(line.includes(':')){
            const parts=line.split(':');
            const key=parts[0].trim();
            const value=parts.slice(1).join(':').trim();
            if(key) data[key]=value;
        }
    });
    return data;
}

// --- Export of Geoman layers (no explicit button) ---
function exportGeomanLayers(){
    const features = [];
    map.eachLayer(layer => {
        if(!layer._drawnByGeoman) return;
        if(layer instanceof L.Circle){
            const c = layer.getLatLng();
            features.push({type:'Feature', geometry:{type:'Point', coordinates:[c.lng,c.lat]}, properties:{type:'circle', radius: layer.getRadius(), color: layer.options.color, fillColor: layer.options.fillColor}});
            return;
        }
        if(layer instanceof L.CircleMarker){
            const c = layer.getLatLng();
            features.push({type:'Feature', geometry:{type:'Point', coordinates:[c.lng,c.lat]}, properties:{type:'circlemarker', radius: layer.options.radius, color: layer.options.color, fillColor: layer.options.fillColor}});
            return;
        }
        try{
            const gj = layer.toGeoJSON();
            gj.properties = gj.properties || {};
            gj.properties.color = layer.options?.color || null;
            gj.properties.fillColor = layer.options?.fillColor || null;
            features.push(gj);
        }catch(e){/* ignore */}
    });
    const fc = {type:'FeatureCollection', features: features};
    geojsonInput.value = JSON.stringify(fc);
    return fc;
}

// --- Messenger send ---
function sendMessenger(){
    const d = collectForm();
    const geo = exportGeomanLayers();
    d.geojson = geo;
    let message = `ALERTE ESAM %0A`;
    message += `Requé: ${d.requerant || ''} - Tel: ${d.tel || ''}%0A`;
    message += `Lieu: ${d.dep || ''} ${d.commune || ''} - ${d.lieux || ''}%0A`;
    message += `Coord: ${d.cord || ''}%0A`;
    message += `Desc: ${d.description || ''}%0A`;
    const url = `https://www.messenger.com/t/4257757770900949?text=${encodeURIComponent(message)}`;
    window.open(url,'_blank');
}

// --- Helpers for map editing state ---
// mark layers created by Geoman
map.on('pm:create', function(e){ if(e.layer) e.layer._drawnByGeoman = true; });

// --- Initialization: center Grenoble marker ---
L.marker(DEFAULT_CENTER).addTo(map);

// --- Fullscreen button (native browser fullscreen) ---
document.getElementById('fullscreenBtn').addEventListener('click', ()=>{
    const el = document.documentElement;
    if(!document.fullscreenElement) el.requestFullscreen().catch(()=>{});
    else document.exitFullscreen();
});

// --- Load saved geojson from hidden input if present ---
if(geojsonInput.value){
    try{
        const g = JSON.parse(geojsonInput.value);
        L.geoJSON(g).addTo(map);
    }catch(e){console.error(e)}
}

// --- End IIFE ---
})();