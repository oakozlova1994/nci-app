  
var btn = document.querySelector('#search-orgcode');
var field = document.querySelector('#search-field');
var container = document.querySelector('#container');
var nciblock = document.querySelector('.nciblock');
var addOption = document.querySelector('#addOption');
var isActive = false;
var xhr = new XMLHttpRequest();
var url = "/validation/api/code";

btn.addEventListener("click", function() {
addOption.onchange = () => (addOption.checked) ? isActive = true : isActive = false; 

if(!isActive) {
    while (nciblock.hasChildNodes()) {
        nciblock.removeChild(nciblock.firstChild);
    }
}

xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
       try{
        let data = JSON.parse(xhr.responseText);        
        renderHTML(data);
       } catch(e) {
           throw Error;
       }
                
    }
};
var data = JSON.stringify({"code": field.value});
xhr.send(data);


});

function renderHTML(data) {
    let obj = {}      
    if (data[0].message === '')     
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
  