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
this.Ninja.module('$fileRequest', ['$curry', '$forEach', '$http', '$t'], function ($curry, $forEach, $http, $t) {
  
  /**
   * Solicitacoes que estao na espera da responsa
   * da requisicao http
   */
  var handlers = {};
  
  /**
   * Estados em que o funcionamento do fileResques
   * para uma determinada url
   */
  var state = {};
  
  /**
   * Requisita arquivos de uma determinada url, fazendo controle das requisicoes
   * com controle de concorrencia de requisicao (semafaro)
   * 
   * @public
   * @method $fileRequest
   * @param {String} url Endereco do arquivo que sera solicitado
   * @param {Function} callback Funcao callback que sera executado na responsa do request
   * @example
   * 
   *        $fileRequest('./ninja.min.js', console.log.bind(console));
   * 
   */
  function fileRequest(url, callback) {
    solveCurrentState(url), state[url](url, callback);
  }
  
  /**
   * Verifica se a url ja esta no localStorage, se estiver ja define o state
   * para ativo
   * 
   * @private
   * @method hasStorage
   * @param {String} url Endereco do arquivo
   * @retutn {Boolean} Responsta da verificacao da existencia do armazenamento do arquivo
   * @example
   * 
   *        $hasStorage('./templates/x-example.html');
   * 
   */
  function hasStorage(url) {
    return !!localStorage.getItem(url) && $t(setTheStateForActive(url));
  }

  /**
   * Executa uma solicitacao http
   * 
   * @private
   * @method requesFile
   * @param {String} url Endereco do arquivo que sera solicitado
   * @example
   * 
   *        requestFile('./ninja.min.js');
   * 
   */
  function requestFile(url) {
    $http('GET', url, '').when(200, function (xhr) {
      savingResponseInTheStorage(url, xhr), setTheStateForActive(url), runQueue(url, xhr);
    });
  }
  
  /**
   * Dispara todos os ouvintes que estao na fila de esperao
   * do retorno da solicitacao do request
   * 
   * @private
   * @method runQueue
   * @example
   * 
   *        runQueue('./ninja.min.js');
   * 
   */
  function runQueue(url, xhr) {
    $forEach(handlers[url], function (a) { a(xhr.responseText); });
  }
  
  /**
   * Salva a responsa da requisao no localStorage evitando
   * futuras solicitacoes
   * 
   * @private
   * @method savingResponseInTheStorage
   * @param {String} url Endereco do arquivo que sera solicitado
   * @param {XMLHttpRequest} xhr Retorno da requisicao http
   * @example
   * 
   *        savingResponseInTheStorage('./ninja.min.js', xhr);
   * 
   */
  function savingResponseInTheStorage(url, xhr) {
    localStorage.setItem(url, xhr.responseText);
  }
  
  /**
   * Altera para o estado em que a resposta da solicitacao do request foi
   * recebido com sucesso
   * 
   * @private
   * @publid setTheStateForActive
   * @param {String} url Endereco do arquivo que sera solicitado
   * @example
   * 
   *        setTheStateForActive('./ninja.min.js');
   * 
   */
  function setTheStateForActive(url) {
    state[url] = function (url, callback) {
      callback(localStorage.getItem(url));
    };
  }
  
  /**
   * Altera para o estado de spera do retorno da solicitacao do request, adicionand
   * as requisicoes para uma lista de espera
   * 
   * @private
   * @method setTheStateForWaiting
   * @param {String} url Endereco do arquivo que sera solicitado
   * @example
   * 
   *        setTheStateForWaiting('./ninja.min.js');
   * 
   */
  function setTheStateForWaiting(url) {
    state[url] = function (url, callback) {
      (handlers[url] = handlers[url] || []).push(callback);
    };
  }
  
  /**
   * Se a url do arquivo nunca tiver sido solicitado
   * sera mudado o stato para a requisicao do arquivo
   * 
   * @private
   * @method solveCurrentState
   * @param {String} url Endereco do arquivo que sera solicitado
   * @example
   * 
   *        solveCurrentState('./ninja.min.js');
   * 
   */
  function solveCurrentState(url) {
    !!state[url] || hasStorage(url) || (setTheStateForWaiting(url), requestFile(url));
  }
  
  /**
   * Revelacao do modulo $fileRequest, encapsulando a visibilidade das funcoes
   * privadas
   */
  return $curry(fileRequest);

});
