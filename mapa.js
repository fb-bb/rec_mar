document.addEventListener('DOMContentLoaded', () => {
  const map = RecifeApp.baseMap('map', { zoom: 13 });
  if (!map) return;

  const detailTitle = document.getElementById('detail-title');
  const detailAddress = document.getElementById('detail-address');
  const detailBadge = document.getElementById('detail-badge');
  const detailType = document.getElementById('detail-type');
  const detailDepth = document.getElementById('detail-depth');
  const detailReports = document.getElementById('detail-reports');
  const detailUpdated = document.getElementById('detail-updated');
  const riskFilter = document.getElementById('risk-filter');

  const renderDetail = point => {
    if (!point || !detailTitle) return;
    detailTitle.textContent = point.title;
    detailAddress.textContent = point.address;
    detailBadge.textContent = point.label;
    detailBadge.className = `chip ${RecifeApp.chipClass(point.level)}`;
    detailType.textContent = point.type;
    detailDepth.textContent = point.depth;
    detailReports.textContent = `${point.reports} relato(s)`;
    detailUpdated.textContent = `Há ${point.updated}`;
  };

  let markerObjects = RecifeApp.addPoints(map, renderDetail);
  renderDetail(RecifeApp.points[0]);

  function applyRiskFilter() {
    const value = riskFilter?.value || 'all';
    markerObjects.forEach(({ point, marker }) => {
      const visible = value === 'all' || point.level === value;
      if (visible && !map.hasLayer(marker)) marker.addTo(map);
      if (!visible && map.hasLayer(marker)) map.removeLayer(marker);
    });
  }
  riskFilter?.addEventListener('change', applyRiskFilter);

  document.getElementById('btn-localizar')?.addEventListener('click', () => RecifeApp.locateUser(map));
  document.getElementById('btn-fullscreen')?.addEventListener('click', async () => {
    const target = document.querySelector('.map-card');
    try {
      if (!document.fullscreenElement) await target.requestFullscreen();
      else await document.exitFullscreen();
      setTimeout(() => map.invalidateSize(), 200);
    } catch { RecifeApp.toast('O modo tela cheia não está disponível neste navegador.'); }
  });

  const searchForm = document.getElementById('map-search-form');
  const searchInput = document.getElementById('map-search-input');
  const SEARCH_CACHE_KEY = 'rcm_geo_cache_v1';
  let lastSearchAt = 0;

  function readCache() {
    try { return JSON.parse(localStorage.getItem(SEARCH_CACHE_KEY) || '{}'); }
    catch { return {}; }
  }
  function writeCache(cache) {
    try { localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cache)); } catch {}
  }

  searchForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const raw = searchInput.value.trim();
    if (raw.length < 3) return RecifeApp.toast('Digite ao menos 3 caracteres para buscar.');

    const query = /recife/i.test(raw) ? raw : `${raw}, Recife, Pernambuco, Brasil`;
    const cache = readCache();
    const cacheKey = query.toLowerCase();
    let result = cache[cacheKey];

    try {
      if (!result) {
        const elapsed = Date.now() - lastSearchAt;
        if (elapsed < 1100) await new Promise(resolve => setTimeout(resolve, 1100 - elapsed));
        lastSearchAt = Date.now();
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
        if (!response.ok) throw new Error('Falha na busca');
        const data = await response.json();
        if (!data.length) return RecifeApp.toast('Endereço não encontrado. Tente informar bairro e rua.');
        result = { lat: data[0].lat, lon: data[0].lon, display_name: data[0].display_name, savedAt: Date.now() };
        cache[cacheKey] = result;
        writeCache(cache);
      }

      const latlng = [Number(result.lat), Number(result.lon)];
      map.setView(latlng, 16);
      L.marker(latlng, { icon: RecifeApp.baseMap ? L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin user"><i class="fa-solid fa-magnifying-glass"></i></div>',
        iconSize: [32,32], iconAnchor: [16,28], popupAnchor: [0,-30]
      }) : undefined })
        .addTo(map)
        .bindPopup(`<div class="map-popup"><h4>Resultado da busca</h4><p>${result.display_name}</p></div>`)
        .openPopup();
    } catch (err) {
      console.error(err);
      RecifeApp.toast('A busca de endereço está indisponível no momento. O mapa continua funcionando normalmente.');
    }
  });

  const params = new URLSearchParams(location.search);
  const lat = Number(params.get('lat'));
  const lng = Number(params.get('lng'));
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat && lng) map.setView([lat, lng], 16);
});
