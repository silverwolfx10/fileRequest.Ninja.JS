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
  
  var listeners = {};
  var state = {};

  function requestFile(url) {
    $http('GET', url, '')
      .when(200, $curry(savingResponseInTheStorage)(url))
      .when(200, $curry(setTheStateForActive)(url))
      .when(200, $curry(runQueue)(url));
  }
  
  function runQueue(url) {
    listeners[url].forEach($curry(state)(url));
  }
  
  function fileRequest(url, callback) {
    solveCurrentState(url);
    state(url, callback);
  }
  
  function setTheStateForWaiting(url, callback) {
    state[url] = function (url, callback) {
      (listeners[url] = listeners[url] || []).push(callback);
    };
  }
  
  function savingResponseInTheStorage(url, xhr) {
    localStorage.setItem(url, xhr.responseText);
  }
  
  function solveCurrentState(url) {
    
    if (state[url]) return;
    
    setTheStateForWaiting();
    requestFile(url);
    
  }
  
  function setTheStateForActive(url) {
    state[url] = function (url, callback) {
      callback(localStorage.getItem(url));
    };
  }
  
  return $curry(fileRequest);

});