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


  // TODO: Refatorar :@

  var handler = {};
  
  return $curry(function (url, callback) {
    
    if (!!handler[url]) {
      return void handler[url](url, callback);
    }
    
    if (!!localStorage.getItem(url)) {
      
      handler[url] = function (url, callback) {
        callback(localStorage.getItem(url));
      };
      
      return void callback(localStorage.getItem(url));
      
    }
    
    var listeners = [callback];
    
    handler[url] = function (url, callback) {
      listeners.push(callback);
    };
    
    $http('get', url, '').when(200, function (xhr) {
      
      localStorage.setItem(url, xhr.responseText);
      
      handler[url] = function (url, callback) {
        callback(xhr.responseText);
      };
      
      listeners.forEach(handler[url].bind(null, null));
      
    });
    
  });

});