const RecifeApp = (() => {
  const points = [
    { id: 1, title: 'Boa Vista', address: 'Rua da Aurora, Boa Vista', lat: -8.05788, lng: -34.88134, level: 'danger', label: 'Risco muito alto', depth: '25–40 cm', reports: 7, type: 'Rua alagada', updated: '10 min' },
    { id: 2, title: 'Santo Amaro', address: 'Av. Norte, Santo Amaro', lat: -8.04759, lng: -34.88472, level: 'danger', label: 'Risco alto', depth: '15–30 cm', reports: 5, type: 'Acúmulo de água', updated: '25 min' },
    { id: 3, title: 'Afogados', address: 'Estrada dos Remédios, Afogados', lat: -8.07398, lng: -34.90731, level: 'danger', label: 'Risco alto', depth: '20–35 cm', reports: 4, type: 'Via parcialmente alagada', updated: '32 min' },
    { id: 4, title: 'Imbiribeira', address: 'Av. Marechal Mascarenhas de Morais', lat: -8.11209, lng: -34.90619, level: 'moderate', label: 'Risco moderado', depth: '10–20 cm', reports: 3, type: 'Ponto de acúmulo', updated: '1 h' },
    { id: 5, title: 'Casa Amarela', address: 'Estrada do Arraial, Casa Amarela', lat: -8.02647, lng: -34.91717, level: 'moderate', label: 'Risco moderado', depth: '5–15 cm', reports: 2, type: 'Drenagem lenta', updated: '1 h 20 min' },
    { id: 6, title: 'Boa Viagem', address: 'Av. Conselheiro Aguiar, Boa Viagem', lat: -8.12199, lng: -34.90067, level: 'low', label: 'Baixo risco', depth: 'Sem lâmina relevante', reports: 1, type: 'Monitoramento', updated: '1 h 40 min' }
  ];

  function markerClass(level) {
    if (level === 'danger') return 'danger';
    if (level === 'moderate') return 'moderate';
    return 'low';
  }

  function chipClass(level) {
    if (level === 'danger') return 'chip-danger';
    if (level === 'moderate') return 'chip-warning';
    return 'chip-success';
  }

  function createMarkerIcon(level, user = false) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin ${user ? 'user' : markerClass(level)}"><i class="fa-solid ${user ? 'fa-location-crosshairs' : 'fa-droplet'}"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 28],
      popupAnchor: [0, -30]
    });
  }

  function popupHtml(point) {
    return `<div class="map-popup">
      <h4>${point.title}</h4>
      <p>${point.address}</p>
      <p>${point.reports} relato(s) · atualizado há ${point.updated}</p>
      <span class="chip ${chipClass(point.level)}">${point.label}</span>
    </div>`;
  }

  function addPoints(map, onSelect) {
    const markers = [];
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lng], { icon: createMarkerIcon(point.level) })
        .addTo(map)
        .bindPopup(popupHtml(point));
      marker.on('click', () => onSelect?.(point));
      markers.push({ point, marker });
    });
    return markers;
  }

  function baseMap(elementId, options = {}) {
    const el = document.getElementById(elementId);
    if (!el || typeof L === 'undefined') return null;
    const map = L.map(elementId, {
      zoomControl: options.zoomControl ?? true,
      scrollWheelZoom: options.scrollWheelZoom ?? true,
      minZoom: 11,
      maxZoom: 19
    }).setView(options.center || [-8.05428, -34.8813], options.zoom || 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  }

  function locateUser(map, onFound) {
    if (!navigator.geolocation) {
      toast('Seu navegador não oferece geolocalização.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        map.setView(latlng, 16);
        L.marker(latlng, { icon: createMarkerIcon('low', true) })
          .addTo(map)
          .bindPopup('<div class="map-popup"><h4>Sua localização</h4><p>Posição aproximada fornecida pelo navegador.</p></div>')
          .openPopup();
        onFound?.(latlng);
      },
      () => toast('Não foi possível acessar sua localização. Verifique a permissão do navegador.'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = '<i class="fa-solid fa-circle-info"></i><span></span>';
      document.body.appendChild(el);
    }
    el.querySelector('span').textContent = message;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function initShell() {
    const menuBtn = document.getElementById('mobile-menu');
    const sidebar = document.querySelector('.sidebar');
    menuBtn?.addEventListener('click', () => sidebar?.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (window.innerWidth > 900 || !sidebar?.classList.contains('open')) return;
      if (!sidebar.contains(e.target) && !menuBtn?.contains(e.target)) sidebar.classList.remove('open');
    });
  }

  return { points, baseMap, addPoints, locateUser, popupHtml, chipClass, toast, initShell };
})();

document.addEventListener('DOMContentLoaded', RecifeApp.initShell);
