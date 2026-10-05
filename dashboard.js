document.addEventListener('DOMContentLoaded', () => {
  const map = RecifeApp.baseMap('map-dashboard', { zoom: 12, scrollWheelZoom: false });
  if (!map) return;
  RecifeApp.addPoints(map);
  document.getElementById('dash-locate')?.addEventListener('click', () => RecifeApp.locateUser(map));
});
