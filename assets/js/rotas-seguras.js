document.addEventListener("DOMContentLoaded", () => {

  const map = L.map("route-map", {
    zoomControl: true
  }).setView([-8.0578, -34.8829], 13);


  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);


  /* =====================================
     ÍCONES
  ===================================== */

  const startIcon = L.divIcon({
    className: "",
    html: `
      <div class="route-marker start">
        <i class="fa-solid fa-location-dot"></i>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });


  const endIcon = L.divIcon({
    className: "",
    html: `
      <div class="route-marker end">
        <i class="fa-solid fa-location-dot"></i>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });


  const dangerIcon = L.divIcon({
    className: "",
    html: `
      <div class="route-marker danger">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });


  /* =====================================
     PONTOS DA ROTA
  ===================================== */

  const origem = [-8.0520, -34.8990];

  const destino = [-8.0440, -34.8910];


  L.marker(origem, {
    icon: startIcon
  })
  .addTo(map)
  .bindPopup(`
    <div class="route-popup">
      <h4>Origem</h4>
      <p>Ponto de partida</p>
    </div>
  `);


  L.marker(destino, {
    icon: endIcon
  })
  .addTo(map)
  .bindPopup(`
    <div class="route-popup">
      <h4>Destino</h4>
      <p>Ponto de chegada</p>
    </div>
  `);


  /* =====================================
     ÁREAS DE RISCO
  ===================================== */

  const areaRisco1 = L.circle(
    [-8.0495, -34.8950],
    {
      radius: 500,
      className: "risk-zone",
      color: "#c63c43",
      fillColor: "#c63c43",
      fillOpacity: 0.10,
      weight: 1
    }
  )
  .addTo(map);


  const areaRisco2 = L.circle(
    [-8.0600, -34.8860],
    {
      radius: 380,
      className: "risk-zone",
      color: "#c63c43",
      fillColor: "#c63c43",
      fillOpacity: 0.10,
      weight: 1
    }
  )
  .addTo(map);


  /* =====================================
     PONTOS DE ALAGAMENTO
  ===================================== */

  L.marker(
    [-8.0495, -34.8950],
    {
      icon: dangerIcon
    }
  )
  .addTo(map)
  .bindPopup(`
    <div class="route-popup">
      <h4>Ponto de alagamento</h4>
      <p>Risco alto</p>
      <p>Evite a área durante chuvas intensas.</p>
    </div>
  `);


  L.marker(
    [-8.0600, -34.8860],
    {
      icon: dangerIcon
    }
  )
  .addTo(map)
  .bindPopup(`
    <div class="route-popup">
      <h4>Área de risco</h4>
      <p>Alagamento registrado</p>
    </div>
  `);


  /* =====================================
     ROTA SEGURA
  ===================================== */

  const rotaSegura = [
    origem,

    [-8.0490, -34.8940],

    [-8.0450, -34.8890],

    destino
  ];


  L.polyline(
    rotaSegura,
    {
      color: "#2a9d8f",
      weight: 4,
      opacity: 1
    }
  )
  .addTo(map);


  /* =====================================
     ROTA ALTERNATIVA / RISCO
  ===================================== */

  const rotaRisco = [
    origem,

    [-8.0570, -34.8950],

    [-8.0600, -34.8860],

    destino
  ];


  L.polyline(
    rotaRisco,
    {
      color: "#c63c43",
      weight: 2,
      opacity: .85,
      dashArray: "5, 6"
    }
  )
  .addTo(map);


  /* =====================================
     AJUSTAR MAPA
  ===================================== */

  const bounds = L.latLngBounds([
    origem,
    destino,
    [-8.0495, -34.8950],
    [-8.0600, -34.8860]
  ]);

  map.fitBounds(bounds, {
    padding: [25, 25]
  });


  /* =====================================
     SELEÇÃO DE ROTAS
  ===================================== */

  const routeOptions = document.querySelectorAll(
    ".route-option"
  );


  routeOptions.forEach((option) => {

    option.addEventListener("click", () => {

      routeOptions.forEach((item) => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");

    });

  });


  /* =====================================
     MENU MOBILE
  ===================================== */

  const menuButton = document.getElementById(
    "mobile-menu"
  );

  const sidebar = document.querySelector(
    ".sidebar"
  );


  if (menuButton && sidebar) {

    menuButton.addEventListener("click", () => {

      sidebar.classList.toggle("open");

    });

  }

});