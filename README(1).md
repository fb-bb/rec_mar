# Recife Contra a Maré

Sistema web para monitoramento de chuvas, alagamentos, ocorrências e rotas seguras na cidade do Recife.

Esta versão foi refatorada para remover o aspecto de protótipo visual genérico, melhorar a experiência do usuário e substituir o mapa fictício por um mapa geográfico real.

---

## 1. Objetivo do projeto

O **Recife Contra a Maré** tem como objetivo permitir que cidadãos consultem áreas com risco de alagamento, acompanhem alertas, registrem ocorrências e visualizem informações de segurança em um mapa interativo.

O projeto também prevê uma área individual do usuário, onde será possível acompanhar registros enviados, alertas, locais monitorados e o andamento das ocorrências.

---

# O que já foi feito

## 2. Refatoração visual

A interface foi redesenhada com foco em **UX/UI**, adotando uma estrutura mais próxima de um sistema institucional e de um dashboard real.

Foram realizados:

- reorganização do layout geral;
- melhoria da hierarquia visual;
- padronização de espaçamentos;
- melhoria da legibilidade;
- padronização de botões, cards, menus e elementos de navegação;
- melhoria da sidebar;
- melhoria do cabeçalho;
- redução do aspecto visual genérico de interface criada por IA;
- responsividade para desktop, tablet e celular;
- criação de um padrão visual único para as páginas principais.

---

## 3. Mapa real

O mapa antigo era apenas uma simulação criada com HTML e CSS.

Ele foi substituído por um mapa real utilizando:

- **Leaflet.js**;
- **OpenStreetMap**.

Essa solução não exige chave de API para o funcionamento básico do mapa.

### Recursos já adicionados

- mapa real de Recife;
- movimentação pelo mapa;
- zoom;
- marcadores geográficos;
- centralização em Recife;
- identificação visual por nível de risco;
- popups com informações dos pontos;
- botão de localização do usuário;
- abertura do mapa em tela cheia;
- pesquisa de endereço;
- integração com Nominatim para geocodificação;
- filtro visual por nível de risco.

---

## 4. Página inicial

A página inicial foi atualizada para funcionar como uma visão geral do sistema.

Ela possui:

- informações de clima;
- alertas ativos;
- dicas de segurança;
- chamada para registro de ocorrência;
- mini mapa real;
- acesso rápido às principais áreas do sistema.

Atualmente, parte das informações apresentadas ainda utiliza dados demonstrativos.

---

## 5. Página de mapa

A página `mapa.html` foi preparada para ser a principal área geográfica do sistema.

Ela possui:

- mapa real;
- marcadores de ocorrências;
- níveis de risco;
- filtro de risco;
- busca por endereço;
- geolocalização;
- detalhes do ponto selecionado;
- painel lateral;
- informações de ocorrências recentes;
- ações rápidas.

---

## 6. Página de alertas

A página `alertas.html` foi reorganizada visualmente para apresentar:

- alertas recentes;
- classificação por gravidade;
- localização do alerta;
- horário da última atualização;
- acesso ao ponto correspondente no mapa.

---

## 7. Dashboard do usuário

Foi criada a página:

```text
dashboard.html
```

O dashboard foi pensado para ser a área pessoal do usuário.

Atualmente possui estrutura para exibir:

- quantidade de registros enviados;
- registros verificados;
- registros em análise;
- quantidade de alertas recebidos;
- locais acompanhados;
- status das ocorrências;
- mapa de locais monitorados;
- atividades recentes;
- atalhos para novos registros;
- informações básicas do usuário.

Os dados apresentados nesta etapa são demonstrativos.

---

## 8. Estrutura atual do projeto

```text
recife-contra-mare-refatorado/
│
├── index.html
├── mapa.html
├── alertas.html
├── dashboard.html
├── README.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── mapa.js
│
└── img/
    └── rec_mar.webp
```

> A pasta `img` deve continuar contendo as imagens utilizadas pelo projeto, principalmente o arquivo `rec_mar.webp`.

---

# O que ainda precisa ser feito

## 9. Criar o back-end

Atualmente o sistema possui principalmente a camada visual/front-end.

É necessário criar um back-end responsável por:

- cadastro de usuários;
- login;
- logout;
- sessões;
- recuperação de senha;
- edição de perfil;
- registro de ocorrências;
- consulta de ocorrências;
- atualização de ocorrências;
- gerenciamento dos alertas;
- gerenciamento dos níveis de risco;
- envio de dados para o mapa;
- leitura dos dados pelo dashboard.

Uma opção adequada para o ambiente atual é utilizar:

```text
PHP + MySQL
```

---

## 10. Criar banco de dados

Será necessário criar as tabelas responsáveis pelo armazenamento das informações reais.

Estrutura inicial sugerida:

### usuarios

```text
id
nome
email
senha
telefone
created_at
updated_at
```

### ocorrencias

```text
id
usuario_id
titulo
descricao
tipo
nivel_risco
latitude
longitude
endereco
bairro
status
created_at
updated_at
```

### alertas

```text
id
titulo
descricao
nivel_risco
latitude
longitude
bairro
ativo
created_at
updated_at
```

### locais_monitorados

```text
id
usuario_id
nome
latitude
longitude
created_at
```

### notificacoes

```text
id
usuario_id
titulo
mensagem
lida
created_at
```

Essa estrutura pode ser ampliada conforme as regras finais do sistema.

---

## 11. Conectar o mapa ao banco de dados

Os pontos atualmente existentes no mapa são demonstrativos.

O próximo passo é fazer o JavaScript buscar os dados de uma API interna, por exemplo:

```text
GET /api/ocorrencias.php
```

A API deverá retornar JSON semelhante a:

```json
[
  {
    "id": 1,
    "titulo": "Alagamento",
    "bairro": "Boa Vista",
    "nivel_risco": "alto",
    "latitude": -8.0578,
    "longitude": -34.8829
  }
]
```

O `mapa.js` utilizará essas informações para criar automaticamente os marcadores.

---

## 12. Criar registro de ocorrência

A página de registro deverá permitir que o usuário informe:

- tipo de problema;
- descrição;
- localização;
- bairro;
- endereço;
- latitude;
- longitude;
- foto;
- nível percebido do problema.

Uma melhoria importante será permitir que o usuário clique no mapa para selecionar a localização.

---

## 13. Upload de imagens

É necessário implementar o envio de imagens das ocorrências.

O sistema deverá:

- validar o tipo do arquivo;
- limitar o tamanho;
- gerar nome seguro;
- salvar no servidor;
- armazenar o caminho no banco;
- impedir upload de arquivos executáveis.

---

## 14. Sistema de login

O dashboard deverá ser acessível apenas por usuários autenticados.

Deve ser criado:

```text
login.php
cadastro.php
logout.php
recuperar-senha.php
```

As senhas devem ser armazenadas utilizando:

```php
password_hash()
```

E verificadas com:

```php
password_verify()
```

---

## 15. Dashboard com dados reais

O arquivo `dashboard.html` atualmente utiliza conteúdo demonstrativo.

Depois da criação do back-end, deverá passar a mostrar dados do usuário autenticado.

Exemplos:

- total de ocorrências enviadas;
- ocorrências aprovadas;
- ocorrências em análise;
- ocorrências resolvidas;
- últimos registros;
- locais monitorados;
- alertas próximos;
- notificações não lidas.

---

## 16. Administração do sistema

Também é recomendada a criação de uma área administrativa.

Exemplo:

```text
/admin/
```

Funções sugeridas:

- visualizar ocorrências;
- aprovar ocorrência;
- rejeitar ocorrência;
- alterar nível de risco;
- cadastrar alertas;
- remover alertas;
- visualizar usuários;
- acompanhar regiões com maior número de ocorrências;
- visualizar estatísticas.

---

## 17. Rotas seguras

A funcionalidade **Rotas Seguras** ainda precisa ser implementada.

Ela poderá utilizar serviços de roteamento compatíveis com OpenStreetMap.

O sistema deverá considerar os pontos classificados como perigosos e evitar determinadas regiões durante o cálculo da rota.

Essa etapa deve ser tratada separadamente porque exige lógica de roteamento mais avançada.

---

## 18. Dados de chuva e clima

Os valores de temperatura, chuva, umidade e vento exibidos atualmente devem ser conectados posteriormente a uma API meteorológica.

O ideal é consultar os dados pelo back-end e repassar somente as informações necessárias ao front-end.

---

## 19. Alertas automáticos

Em uma versão posterior, o sistema poderá cruzar:

```text
chuva + histórico de ocorrências + localização + nível de risco
```

para gerar alertas automaticamente.

Também poderá enviar notificações para usuários que acompanham uma determinada região.

---

## 20. Segurança

Antes da publicação definitiva, implementar:

- validação de todos os dados recebidos;
- prepared statements com PDO;
- proteção contra SQL Injection;
- proteção contra XSS;
- CSRF Token;
- controle de sessão;
- limite de requisições;
- validação segura de uploads;
- controle de permissões;
- HTTPS;
- logs do sistema.

---

# Prioridade recomendada de desenvolvimento

A ordem recomendada para continuar o projeto é:

```text
1. Banco de dados
2. Cadastro e login
3. API de ocorrências
4. Registro de ocorrência
5. Mapa lendo ocorrências reais
6. Dashboard lendo dados reais
7. Painel administrativo
8. Alertas reais
9. Dados meteorológicos
10. Rotas seguras
11. Notificações
12. Testes e segurança
13. Publicação
```

---

# Como executar a versão atual

Como o projeto atual utiliza HTML, CSS e JavaScript, basta colocá-lo em um servidor web.

Exemplos:

```text
XAMPP
WAMP
Laragon
Apache
Nginx
cPanel
```

Também é possível testar temporariamente com uma extensão de servidor local, como o Live Server.

Para recursos como geolocalização do navegador, recomenda-se utilizar:

```text
http://localhost
```

ou um domínio com:

```text
https://
```

---

# Tecnologias utilizadas atualmente

```text
HTML5
CSS3
JavaScript
Leaflet.js
OpenStreetMap
Nominatim
Font Awesome
```

Tecnologias previstas para a próxima etapa:

```text
PHP
MySQL
PDO
API REST/JSON
```

---

# Situação atual

O projeto já possui uma estrutura visual funcional e um mapa geográfico real.

Neste momento ele deve ser considerado um **front-end funcional/protótipo navegável**.

Para se tornar um sistema completo, a prioridade agora é desenvolver o **back-end, banco de dados e integração dos dados reais com o mapa e o dashboard**.

