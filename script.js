// ============================================================
// Script principal - ESAM Pat'rouille Refonte
// ============================================================

(function () {
  // === CONFIGURATION ===
  const DEFAULT_CENTER = [45.214659, 5.846747];
  const DEFAULT_ZOOM = 12;
  const IGN_API_KEY = "ta-cle-api"; // 🔑 Remplace avec ta clé IGN

  // === RÉFÉRENCES DOM ===
  const coordInput = document.getElementById("cord");
  const depInput = document.getElementById("dep");
  const communeInput = document.getElementById("commune");
  const geojsonInput = document.getElementById("geojson");
  const fileInput = document.getElementById("fileInput");
  const colorContainer = document.getElementById("color-control");

  // === INITIALISATION DE LA CARTE ===
  const map = L.map("map", {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  // Couches
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  const ign = L.tileLayer(
    `https://wxs.ign.fr/${IGN_API_KEY}/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0` +
      "&layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal" +
      "&tilematrixset=PM&format=image/png&tilematrix={z}&tilerow={y}&tilecol={x}",
    {
      minZoom: 0,
      maxZoom: 18,
      attribution: "© IGN",
    }
  );

  L.control.layers({ OSM: osm, "IGN Plan": ign }).addTo(map);

  // === CONTROLES GEOMAN ===
  map.pm.addControls({
    position: "topright",
    drawMarker: true,
    drawPolygon: true,
    drawPolyline: true,
    drawCircle: true,
    drawRectangle: true,
    editMode: true,
    removalMode: true,
  });

  // === OUTIL DE COULEUR ===
  let currentColor = "#3388ff";
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = currentColor;
  colorPicker.title = "Choisir la couleur";
  colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
  });
  colorContainer.appendChild(colorPicker);

  // === SÉLECTION ET COLORATION D'UNE FORME ===
  map.on("pm:create", (e) => {
    const layer = e.layer;
    layer._drawnByGeoman = true;
    if (layer.setStyle)
      layer.setStyle({ color: currentColor, fillColor: currentColor });

    layer.on("click", () => {
      if (layer.setStyle)
        layer.setStyle({ color: currentColor, fillColor: currentColor });
    });
  });

  // === CLAVIER / CLIC COORDONNÉES ===
  map.on("click", (e) => {
    if (document.activeElement === coordInput) {
      const lat = e.latlng.lat.toFixed(5);
      const lng = e.latlng.lng.toFixed(5);
      coordInput.value = `${lat}, ${lng}`;
    }
  });

  // === CENTRER SUR COORDONNÉES ===
  window.centercordonnee = function () {
    const val = coordInput.value;
    if (!val) return;
    const [lat, lng] = val.split(",").map((v) => parseFloat(v.trim()));
    if (isNaN(lat) || isNaN(lng)) return alert("Coordonnées invalides");
    L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 14);
  };

  // === GÉOCODAGE COMMUNE ===
  function loadDepartements() {
    fetch("https://geo.api.gouv.fr/departements")
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("dep_list");
        data.forEach((d) => {
          const opt = document.createElement("option");
          opt.value = `${d.code} - ${d.nom}`;
          list.appendChild(opt);
        });
      });
  }
  loadDepartements();

  communeInput.addEventListener("change", () => {
    const communeName = communeInput.value.trim();
    if (!communeName) return;
    const depCode = depInput.value.split(" ")[0];
    fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
        communeName
      )}&fields=nom,code,centre`
    )
      .then((res) => res.json())
      .then((communes) => {
        const match = communes.find((c) => {
          const codeDep = c.code.slice(0, 2);
          return (
            (!depCode || codeDep === depCode) &&
            c.nom.toLowerCase() === communeName.toLowerCase()
          );
        });
        if (match) {
          const [lng, lat] = match.centre.coordinates;
          map.setView([lat, lng], 14);
        } else {
          alert("Commune introuvable.");
        }
      });
  });

  // === CONVERTISSEUR GPS ===
  function ddToDms(deg) {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d - m / 60) * 3600).toFixed(2);
    return [d, m, s];
  }
  function ddToDmd(deg) {
    const abs = Math.abs(deg);
    const d = Math.floor(abs);
    const m = ((abs - d) * 60).toFixed(3);
    return [d, m];
  }
  function dmsToDd(d, m, s, ref) {
    if (d === "" || m === "" || s === "") return NaN;
    let dd = parseFloat(d) + parseFloat(m) / 60 + parseFloat(s) / 3600;
    if (ref === "S" || ref === "W") dd *= -1;
    return dd;
  }
  function dmdToDd(d, m, ref) {
    if (d === "" || m === "") return NaN;
    let dd = parseFloat(d) + parseFloat(m) / 60;
    if (ref === "S" || ref === "W") dd *= -1;
    return dd;
  }

  // Récup des éléments du convertisseur
  const latDD = document.getElementById("latDD");
  const lonDD = document.getElementById("lonDD");
  const latD = document.getElementById("latD");
  const latM = document.getElementById("latM");
  const latS = document.getElementById("latS");
  const latRef = document.getElementById("latRef");
  const lonD = document.getElementById("lonD");
  const lonM = document.getElementById("lonM");
  const lonS = document.getElementById("lonS");
  const lonRef = document.getElementById("lonRef");
  const latDmdD = document.getElementById("latDmdD");
  const latDmdM = document.getElementById("latDmdM");
  const latDmdRef = document.getElementById("latDmdRef");
  const lonDmdD = document.getElementById("lonDmdD");
  const lonDmdM = document.getElementById("lonDmdM");
  const lonDmdRef = document.getElementById("lonDmdRef");

  function updateAllFromDD(lat, lon) {
    if (isNaN(lat) || isNaN(lon)) return;
    const [d1, m1, s1] = ddToDms(lat);
    const [d2, m2, s2] = ddToDms(lon);
    latD.value = d1;
    latM.value = m1;
    latS.value = s1;
    latRef.value = lat >= 0 ? "N" : "S";
    lonD.value = d2;
    lonM.value = m2;
    lonS.value = s2;
    lonRef.value = lon >= 0 ? "E" : "W";
    const [dd1, mm1] = ddToDmd(lat);
    const [dd2, mm2] = ddToDmd(lon);
    latDmdD.value = dd1;
    latDmdM.value = mm1;
    latDmdRef.value = lat >= 0 ? "N" : "S";
    lonDmdD.value = dd2;
    lonDmdM.value = mm2;
    lonDmdRef.value = lon >= 0 ? "E" : "W";
  }

  latDD.addEventListener("input", () => {
    const lat = parseFloat(latDD.value);
    const lon = parseFloat(lonDD.value);
    if (!isNaN(lat) && !isNaN(lon)) updateAllFromDD(lat, lon);
  });
  lonDD.addEventListener("input", () => {
    const lat = parseFloat(latDD.value);
    const lon = parseFloat(lonDD.value);
    if (!isNaN(lat) && !isNaN(lon)) updateAllFromDD(lat, lon);
  });

  [latD, latM, latS, latRef, lonD, lonM, lonS, lonRef].forEach((el) =>
    el.addEventListener("input", () => {
      const lat = dmsToDd(latD.value, latM.value, latS.value, latRef.value);
      const lon = dmsToDd(lonD.value, lonM.value, lonS.value, lonRef.value);
      if (isNaN(lat) || isNaN(lon)) return;
      latDD.value = lat.toFixed(6);
      lonDD.value = lon.toFixed(6);
      updateAllFromDD(lat, lon);
    })
  );

  [latDmdD, latDmdM, latDmdRef, lonDmdD, lonDmdM, lonDmdRef].forEach((el) =>
    el.addEventListener("input", () => {
      const lat = dmdToDd(latDmdD.value, latDmdM.value, latDmdRef.value);
      const lon = dmdToDd(lonDmdD.value, lonDmdM.value, lonDmdRef.value);
      if (isNaN(lat) || isNaN(lon)) return;
      latDD.value = lat.toFixed(6);
      lonDD.value = lon.toFixed(6);
      updateAllFromDD(lat, lon);
    })
  );

  // === EXPORT GEOJSON ===
  function exportGeomanLayers() {
    const features = [];
    map.eachLayer((layer) => {
      if (!layer._drawnByGeoman) return;
      try {
        const gj = layer.toGeoJSON();
        gj.properties = {
          ...gj.properties,
          color: layer.options.color || null,
          fillColor: layer.options.fillColor || null,
        };
        features.push(gj);
      } catch {}
    });
    const geojson = { type: "FeatureCollection", features };
    geojsonInput.value = JSON.stringify(geojson);
    return geojson;
  }

  // === SAUVEGARDE / CHARGEMENT LOCAL ===
  window.saveLocal = function () {
    const data = collectForm();
    data.geojson = exportGeomanLayers();
    localStorage.setItem("alerteData", JSON.stringify(data));
    alert("Formulaire sauvegardé localement.");
  };

  window.loadLocal = function () {
    const raw = localStorage.getItem("alerteData");
    if (!raw) return alert("Aucune sauvegarde locale trouvée.");
    const data = JSON.parse(raw);
    fillForm(data);
    if (data.geojson) L.geoJSON(data.geojson).addTo(map);
  };

  // === TÉLÉCHARGEMENT TXT ===
  window.downloadTxt = function () {
    const data = collectForm();
    const content = Object.entries(data)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "alerte.txt";
    a.click();
  };

  // === CHARGEMENT FICHIER TXT ===
  window.uploadFile = function () {
    const file = fileInput.files[0];
    if (!file) return alert("Choisir un fichier .txt");
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split("\n");
      const data = {};
      lines.forEach((l) => {
        if (l.includes(":")) {
          const [k, ...rest] = l.split(":");
          data[k.trim()] = rest.join(":").trim();
        }
      });
      fillForm(data);
    };
    reader.readAsText(file);
  };

  // === MESSENGER ===
  window.sendMessenger = function () {
    const data = collectForm();
    const msg =
      `ALERTE ESAM %0A` +
      `Requérant: ${data.requerant || ""} (%20${data.tel || ""})%0A` +
      `Lieu: ${data.dep || ""} - ${data.commune || ""}%0A` +
      `Coord: ${data.cord || ""}%0A` +
      `Description: ${data.description || ""}%0A` +
      `%0A-- Pat'rouille Refonte --`;
    const url = `https://www.messenger.com/t/4257757770900949?text=${msg}`;
    window.open(url, "_blank");
  };

  // === UTILITAIRES ===
  function collectForm() {
    const form = document.getElementById("alerteForm");
    const data = {};
    new FormData(form).forEach((v, k) => (data[k] = v));
    return data;
  }

  function fillForm(data) {
    Object.entries(data).forEach(([k, v]) => {
      const el = document.getElementsByName(k)[0] || document.getElementById(k);
      if (el) el.value = v;
    });
  }

  // === PLEIN ÉCRAN ===
  document.getElementById("fullscreenBtn").addEventListener("click", () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  });

  // === INIT ===
  L.marker(DEFAULT_CENTER).addTo(map);
})();
