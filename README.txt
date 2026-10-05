RECIFE CONTRA A MARÉ — versão refatorada

Arquivos principais:
- index.html: home / visão geral
- mapa.html: mapa real com Leaflet + OpenStreetMap
- alertas.html: listagem profissional de alertas
- dashboard.html: painel do usuário
- assets/css/style.css: novo design system e responsividade
- assets/js/app.js: dados, shell e funções comuns
- assets/js/home.js: minimapa da home
- assets/js/mapa.js: mapa completo, filtros, geolocalização e busca
- assets/js/dashboard.js: mapa do painel do usuário

IMPORTANTE
1. Copie a pasta img do seu projeto atual para esta pasta, principalmente img/rec_mar.webp.
2. Leaflet 1.9.4 é carregado por CDN e não requer chave de API.
3. O mapa usa tiles do OpenStreetMap com atribuição visível.
4. A busca por endereço usa o Nominatim público somente quando o usuário envia a busca, sem autocomplete, com cache local e limitação de frequência. Para um sistema de alto tráfego, troque por um provedor de geocodificação próprio/contratado.
5. Geolocalização funciona apenas em HTTPS ou localhost, conforme as regras dos navegadores.
6. Os pontos de alagamento do exemplo são dados demonstrativos em coordenadas reais de Recife; conecte-os ao seu backend/banco para dados dinâmicos.
