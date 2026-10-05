document.addEventListener('DOMContentLoaded', () => {
  const map = RecifeApp.baseMap('map-home', { zoom: 12, zoomControl: false, scrollWheelZoom: false });
  if (!map) return;
  RecifeApp.addPoints(map);
});
