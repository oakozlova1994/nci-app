  
var btn = document.querySelector('#search-orgcode');
var field = document.querySelector('#search-field');
var container = document.querySelector('#container');
var nciblock = document.querySelector('.nciblock');
var addOption = document.querySelector('#addOption');
var isActive = false;
var murl = "/validation/api/code";
var reg = new RegExp("^[0-9]{2,8}(.*)?[0-9]$");

btn.addEventListener('click', ajaxCall, true);

function ajaxCall() {    
        addOption.onchange = () => (addOption.checked) ? isActive = true : isActive = false; 
        
        if(!isActive) {
            while (nciblock.hasChildNodes()) {
                nciblock.removeChild(nciblock.firstChild);
            }
        }
        if (reg.test(field.value) == false || field.value.length <= 4) {return nciblock.insertAdjacentHTML("beforeend","<strong>there is no more donuts here :)</strong>");}
        
        var data = { "code": field.value };        
        $.ajax({
            url: murl,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",            
        }).done(function(data){
            if (data.length === 0)     
                return nciblock.insertAdjacentHTML("beforeend", "Запись не найдена!");     
            renderHTML(data);
          });
                
        }


function renderHTML(data) {
    let obj = {}    
    if (data === null || data === undefined)     
            return nciblock.insertAdjacentHTML("beforeend", "Запись не найдена!");     
    for (let i=0; i < data.length; i++ ) {        
        obj = data[i]; 
        
        nciblock.insertAdjacentHTML("beforeend", 
        `<div class="card list-bottom">
            <div class="card-header orgcode">${obj.orgcode}</div>
        <ul class="list-group list-group-flush">   
            <li class="list-group-item list-group-item-dark">${obj.name}</li>         
            <li class="list-group-item list-group-item-danger">${obj.message}</li>
            <li class="list-group-item list-group-item-dark">${obj.description}</li>
            <li class="list-group-item list-group-item-danger">${obj.date.substring(obj.date.indexOf('T'), 0)}</li>
        </ul>
        </div>`
        );
    }
}
  