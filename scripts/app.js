(function() {
  'use strict';

  var app = {
    isLoading: false,
    visibleCards: {},
    selectedCoins: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container')
  };


  document.getElementById('butRefresh').addEventListener('click', function() {
    app.updateCards();
  });

  document.getElementById('butAdd').addEventListener('click', function() {
    app.toggleAddDialog(true);
  });

  document.getElementById('butAddCoin').addEventListener('click', function() {
    var select = document.getElementById('selectCoinToAdd');
    var selected = select.options[select.selectedIndex];
    var id = selected.value;
    var name = selected.textContent;
    app.getCryptoCoinData(id, name);
    app.selectedCoins.push({id: id, name: name});
    app.saveSelectedCoins();
    app.toggleAddDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    app.toggleAddDialog(false);
  });

  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  app.updateCards = function() {
    var ids = Object.keys(app.visibleCards);
    ids.forEach(function(id) {
      app.getCryptoCoinData(id, name);
    });
  };

  app.updateCoinCard = function(data) {
    var dataLastUpdated = new Date(data.last_updated*1000);

    var card = app.visibleCards[data.id];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.name;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.id] = card;
    }

    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;

    card.querySelector('.weather-forecast .updated').textContent = dataLastUpdated.toLocaleDateString() + 
    ' ' + dataLastUpdated.toTimeString().split(' ')[0];
    card.querySelector('.current .icon').classList.add(data.id.toLowerCase());
    card.querySelector('.current .btc').textContent = data.price_btc;
    card.querySelector('.current .rank').textContent = data.rank;
    card.querySelector('.current .usd .value').textContent = '$' + data.price_usd;
    card.querySelector('.current .usd .percent').textContent = '(' + data.percent_change_24h + '%)';
    if (data.percent_change_24h > 0) {
      card.querySelector('.current .usd .percent').classList.add('up');
      card.querySelector('.current .usd .percent').classList.remove('down');
    } else if (data.percent_change_24h < 0) {
      card.querySelector('.current .usd .percent').classList.remove('up');
      card.querySelector('.current .usd .percent').classList.add('down');
    }
    card.querySelector('.current .symbol').textContent = data.symbol;
    // card.querySelector('.current .wind .direction').textContent = wind.direction;
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.isLoading = false;
    }
  };


  app.getCryptoCoinData = function(id, name) {
    var url = 'https://api.coinmarketcap.com/v1/ticker/' + id + '/';

    var initial = {
      id: id, 
      name: name, 
      symbol: 0, 
      rank: 0, 
      price_usd: 0, 
      price_btc: 0, 
      percent_change_24h: 0,
      last_updated: new Date().getTime() / 1000
    };
    app.updateCoinCard(initial);

    if (!app.isLoading) {
      app.spinner.removeAttribute('hidden');
      app.isLoading = true;
    }

    fetch(url).then(function (response) {
      return response.json();
    }).then(function(data) {
      app.updateCoinCard(data[0]);
    }).catch(function () {
      if (app.isLoading) {
        app.spinner.setAttribute('hidden', true);
        app.isLoading = false;
      }
    });
  };

  // Salva a lista de moedas no localstorage.
  app.saveSelectedCoins = function() {
    var selectedCoins = JSON.stringify(app.selectedCoins);
    localStorage.selectedCoins = selectedCoins;
  };

  if (!!localStorage.selectedCoins) {
    app.selectedCoins = localStorage.selectedCoins;
    app.selectedCoins = JSON.parse(app.selectedCoins);
    app.selectedCoins.forEach(function(coin) {
      app.getCryptoCoinData(coin.id, coin.name);
    });
  }

    if ('serviceWorker' in navigator) {
        var url = '';
        if (location.hostname === "m4rkux.github.io") {
            url = '/crypto-pwa'
        }
        navigator.serviceWorker.register(url + '/service-worker.js').then(function () {
            console.log('Service Worker Registered');
        });    
    }

})();
