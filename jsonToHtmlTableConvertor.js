function json2Table(json,parentElement) {
    return new Promise((resolve,reject) =>{
        let root = document.getElementById(parentElement);
        let rootTable = document.createElement('table');
        // we need to create one tHead for all objects of array
        // beyond the scope of new recursion
        let rootKeySet = new Set();
        //prepare tHead if json root node is object
        if (json && (!Array.isArray(json)) && ( typeof json === 'object')) {
            let rootTHead = document.createElement('thead');
            for (let key in json) {
                if (json.hasOwnProperty(key)) {
                    if (!rootKeySet.has(key)) {
                        rootKeySet.add(key); // we have all keys of objects as bonus
                        let thForObject = document.createElement('th');
                        thForObject.appendChild(document.createTextNode(key));
                        rootTHead.appendChild(thForObject);
                    }
                }
            }
            rootTable.appendChild(rootTHead);
        }

        root.appendChild(rootTable);

        let rootTdForTableOfObjects = document.createElement('td');

        // * we assume that we have more than one object in parent element
        // create common tHead for them
        function createTHead(jsonData, table, keySet) {
            if (Array.isArray(jsonData)) {
                for (let obj of jsonData) {
                    if (obj && (!Array.isArray(obj)) && (typeof obj === 'object')) {
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                if (!keySet.has(key)) {
                                    keySet.add(key); // we have all keys of objects as bonus
                                    let thForObject = document.createElement('th');
                                    thForObject.appendChild(document.createTextNode(key));
                                    table.tHead.appendChild(thForObject);
                                }
                            }
                        }
                    }
                }
            }
            if (jsonData && (!Array.isArray(jsonData)) && (typeof jsonData === 'object')) {
                for (let key in jsonData) {
                    if (jsonData[key] && (!Array.isArray(jsonData[key])) && (typeof jsonData[key] === 'object')) {
                        for (let k in jsonData[key]) {
                            if (jsonData[key].hasOwnProperty(k)) {
                                if (!keySet.has(k)) {
                                    keySet.add(k); // we have all keys of objects as bonus
                                    let thForObject = document.createElement('th');
                                    thForObject.appendChild(document.createTextNode(k));
                                    table.tHead.appendChild(thForObject);
                                }
                            }
                        }
                    }
                }
            }
        }
        function createTable(json,rootTable,tdForObjectsTable,keySet) {
            return new Promise((resolve,reject) =>{

                let tableForChildElement = document.createElement('table');
                let tHeadForChildElement = document.createElement('thead');
                tableForChildElement.appendChild(tHeadForChildElement);
                // * we need to crate one tHead for all objects of array
                // beyond the scope of new recursion
                let innerTdForTableOfObjects = document.createElement('td');

                let keySetInRecur = new Set();

                createTHead(json,tableForChildElement,keySetInRecur);
                if(Array.isArray(json)){
                    let trForArray = document.createElement('tr');
                    for(let jsonVal of json){
                        // If we won't check again if value of array is array we will insert same value twice.
                        // Once from recursion stack. Once per root stack.
                        if(Array.isArray(jsonVal)) {
                            let tdForArray = document.createElement('td');

                            tdForArray.appendChild(tableForChildElement);
                            try {
                                resolve(createTable(jsonVal, tableForChildElement, innerTdForTableOfObjects, keySetInRecur));
                            } catch (e){
                                reject(e);
                            }
                            trForArray.appendChild(tdForArray);
                        } else if (jsonVal && (!Array.isArray(jsonVal)) && (typeof jsonVal === 'object')){
                            // Structure can be like [ {} {} {} {} ] - many objects in one array.
                            // This way we can share one tHead for all objects *
                            // and put all objects into 1 table
                            tdForObjectsTable.appendChild(tableForChildElement);
                            try{
                                resolve(createTable(jsonVal, tableForChildElement, innerTdForTableOfObjects,keySetInRecur));
                            } catch (e) {
                                reject (e);
                            }
                            trForArray.appendChild(tdForObjectsTable);

                        } else {
                            let tdForArray = document.createElement('td');
                            tdForArray.appendChild(document.createTextNode(jsonVal));
                            trForArray.appendChild(tdForArray);
                        }
                    }
                    //But array do not need tHead. It has no keys
                    //But we NEED tHead BEFORE we know  if we need it, on previous stack of recursion
                    rootTable.removeChild(rootTable.tHead);
                    rootTable.appendChild(trForArray);
                }
                if (json && (!Array.isArray(json)) && ( typeof json === 'object')){
                    let trForObject = document.createElement('tr');
                    //than fill data from objects into the tr's of root table
                    for ( let keyOfSet of keySet) {
                        let tdForObject = document.createElement('td');
                        if (json.hasOwnProperty(keyOfSet)) {
                            if (Array.isArray(json[keyOfSet])) {

                                tdForObject.appendChild(tableForChildElement);
                                try{
                                    resolve(createTable(json[keyOfSet], tableForChildElement, innerTdForTableOfObjects, keySetInRecur));
                                } catch (e) {
                                    reject(e);
                                }
                                trForObject.appendChild(tdForObject);

                            } else if (json[keyOfSet] && (!Array.isArray(json[keyOfSet])) && (typeof json[keyOfSet] === 'object')) {

                                tdForObjectsTable.appendChild(tableForChildElement);
                                try{
                                    resolve(createTable(json[keyOfSet], tableForChildElement, innerTdForTableOfObjects, keySetInRecur));
                                } catch (e) {
                                    reject(e);
                                }
                                trForObject.appendChild(tdForObjectsTable);

                            } else {
                                tdForObject.appendChild(document.createTextNode(json[keyOfSet]));
                                trForObject.appendChild(tdForObject);
                            }
                        } else{
                            trForObject.appendChild(tdForObject);
                        }
                    }
                    rootTable.appendChild(trForObject);
                }

            })
        }

        try{
            resolve(createTable(json,rootTable,rootTdForTableOfObjects,rootKeySet));
        } catch (e) {
            reject(e)
        }
    })
}
function promisedParseJSON(json) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(json));
        } catch (e) {
            reject(e)
        }
    })
}

function createControlPanel(parentId, parentOfTable, parentOfShowHTML) {
    let parentElement = document.getElementById(parentId);

    let pForTextArea = document.createElement('p');
    let pForButtons = document.createElement('p');

    let textArea = document.createElement('textarea');
    textArea.rows = 25;
    textArea.cols = 35;

    let createButton = document.createElement('button');
    createButton.innerHTML = "Add table";

    let removeButton = document.createElement('button');
    removeButton.innerHTML = "Remove table";

    let showHTMLButton = document.createElement('button');
    showHTMLButton.innerHTML = "Show HTML";

    pForTextArea.appendChild(textArea);
    pForButtons.appendChild(createButton);
    pForButtons.appendChild(removeButton);
    pForButtons.appendChild(showHTMLButton);

    parentElement.appendChild(pForTextArea);
    parentElement.appendChild(pForButtons);

    function removeLastTable() {
        let select = document.getElementById(parentOfTable);
        select.removeChild(select.lastChild);
    }
    function showTable() {
        promisedParseJSON(textArea.value).then(json => json2Table(json,parentOfTable))
            .catch(err => {
                alert("Error during parsing json: " + err);
            });
    }
    function showHTML() {
        let selectShowHTML = document.getElementById(parentOfShowHTML);
        let selectTableDiv = document.getElementById(parentOfTable);
        let text = document.createTextNode("<"+selectTableDiv.tagName +">"+selectTableDiv.innerHTML+ "</"+selectTableDiv.tagName+">");
        selectShowHTML.appendChild(text);
    }
    removeButton.addEventListener("click", removeLastTable);
    createButton.addEventListener("click", showTable);
    showHTMLButton.addEventListener("click", showHTML);
}
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        createControlPanel("controlPanel", "tableDiv", "showHtml");
    }
};
