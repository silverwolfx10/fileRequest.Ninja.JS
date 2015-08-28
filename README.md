### $fileRequest

Requisita arquivos de uma determinada url, fazendo controle das requisicoes com controle de concorrencia de requisicao (semafaro) a funcao curry

```javascript
this.Ninja(['$fileRequest'], function ($fileRequest) {

  function render(file) {
    document.querySelector('body').innerHTML = file;
  }
  
  $fileRequest('./template.html', render);
  
});
```
