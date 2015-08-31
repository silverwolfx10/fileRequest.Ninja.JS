/**
 * $fileRequest
 * 
 * Requisita arquivos de uma determinada url, fazendo controle das requisicoes
 * com controle de concorrencia de requisicao (semafaro) a funcao curry
 * 
 * @module $fileRequest
 * @author Cleber de Moraes Goncalves <cleber.programmer>
 * @example
 * 
 *        $fileRequest('./ninja.min.js', console.log.bind(console));
 * 
 */
this.Ninja.module('$fileRequest', ['$curry', '$http'], function ($curry, $http) {
  
  var handlers = {};
  var state = {};
  
  function fileRequest(url, callback) {
    solveCurrentState(url);
    state(url, callback);
  }

  function requestFile(url) {
    $http('GET', url, '')
      .when(200, $curry(savingResponseInTheStorage)(url))
      .when(200, $curry(setTheStateForActive)(url))
      .when(200, $curry(runQueue)(url));
  }
  
  function runQueue(url) {
    handlers[url].forEach($curry(state)(url));
  }
  
  function savingResponseInTheStorage(url, xhr) {
    localStorage.setItem(url, xhr.responseText);
  }
  
  function setTheStateForActive(url) {
    state[url] = function (url, callback) {
      callback(localStorage.getItem(url));
    };
  }
  
  function setTheStateForWaiting(url, callback) {
    state[url] = function (url, callback) {
      (handlers[url] = handlers[url] || []).push(callback);
    };
  }
  
  function solveCurrentState(url) {
    if (!state[url]) {
      setTheStateForWaiting();
      requestFile(url);
    }
  }
  
  return $curry(fileRequest);

});