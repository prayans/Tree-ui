
var moduleUiTree = function(dataJson){
    Element.prototype.hasClassName = function(name) {
        return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
    };

    Element.prototype.addClassName = function(name) {
        if (!this.hasClassName(name)) {
            this.className = this.className ? [this.className, name].join(' ') : name;
        }
        return this;
    };

    Element.prototype.removeClassName = function(name) {
        if (this.hasClassName(name)) {
            var c = this.className;
            this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
        }
        return this;
    };


    var removeTreeNode = function() {
        editElement = false;
        var node = this.parentElement.parentElement.parentElement;
        if (node.childElementCount === 1) {
            if (node.previousElementSibling) {
                var firstChild = node.previousElementSibling.firstElementChild;
                firstChild.parentNode.removeChild(firstChild);
            }
        }
        this.parentElement.parentElement.parentNode.removeChild(this.parentElement.parentElement);
        resetDraggables();
        displayJson(generateJson("tree-root"));
    };


//var allnodes = [{id: 0, title: "root"}];
    var newNode = function() {
        var element = this.parentElement;
        var Id = (+element.getAttribute("id"));
      //  console.log("path " + (+element.getAttribute("path")));
        var nodesLength = element.nextElementSibling.childElementCount;
        var newItem = generateTreeNode({
            id: Id * 10 + nodesLength + 1,
            title: element.innerText + '.' + (nodesLength + 1),
            path: (+element.getAttribute("path")) + '/' + element.innerText + '.' + (nodesLength + 1)
        });
       // allnodes.push({id: newItem.id, title: newItem.title});
        newItem.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
        element.nextElementSibling.appendChild(newItem);
        if (nodesLength === 0) {
            insertHtmlArrow(element.parentElement);
        }
        makeDraggable(newItem.firstChild);
        resetDraggables();
        displayJson(generateJson("tree-root"));
    };

    var toggleNode = function() {
        if (this.firstElementChild.hasClassName("glyphicon-chevron-down")) {
            this.firstElementChild.removeClassName("glyphicon-chevron-down").addClassName("glyphicon-chevron-right");
            this.parentElement.nextElementSibling.style.display = "none";
        } else {
            this.firstElementChild.removeClassName("glyphicon-chevron-right").addClassName("glyphicon-chevron-down");
            this.parentElement.nextElementSibling.style.display = "block";
        }
    };

    var getInputText = function(){
        var text = (this.value).replace(/[\\\"\'<\>\}\{\[\]\`\/]/gi,'').trim() || this.getAttribute("data-old-text") ;
        this.parentElement.innerHTML = text;
        displayJson(generateJson("tree-root"));
        editElement = false;
    }

    var getInputTextOnEnter = function(e){
        var key = e.which || e.keyCode;
        if (key === 13) { 
            var text = (this.value).replace(/[\\\"\'<\>\}\{\[\]\`\/]/gi,'').trim() || this.getAttribute("data-old-text");
            this.removeEventListener("blur", getInputText);
            this.parentElement.innerHTML = text;
        }
        displayJson(generateJson("tree-root"));
        editElement = false;
    }

    var nodeEditText = function(){
        editElement = true;
        var text = this.innerText;
        this.innerHTML = "";
        var input = createDomElement("input", "", "", {type: "text", value: text});
        input.addEventListener("blur", getInputText);
        input.addEventListener("keydown", getInputTextOnEnter);
        input.addEventListener("dblclick", function(e){ e.stopPropagation(); return false;})
        input.setAttribute("data-old-text", text);
        this.appendChild(input);
        input.focus();
    };


    var generateTreeNode = function(item) {
        var li = createDomElement("li", "", "ui-tree-node");
        var div = createDomElement("div", item.id, "tree-node tree-node-content ui-tree-handle");

        var span = createDomElement("span", "", "text-edit");
        span.innerText = item.title;
        span.addEventListener('dblclick', nodeEditText);
        div.appendChild(span);


        var removeButton = createDomElement("a", "", "pull-right btn btn-danger btn-xs remove-btn");
        removeButton.addEventListener("click", removeTreeNode);
        removeButton.appendChild(createDomElement("span", "", "glyphicon glyphicon-remove"));

        var newItem = createDomElement("a", "", "pull-right btn btn-primary btn-xs margin-right8 new-item-btn");
        newItem.addEventListener("click", newNode);
        newItem.appendChild(createDomElement("span", "", "glyphicon glyphicon-plus"));

        div.appendChild(removeButton);
        div.appendChild(newItem);
        li.appendChild(div);
        return li;
    };

    var insertHtmlArrow = function(li) {
        var arrow = createDomElement("a", "", "btn btn-success btn-xs toogle-btn");
        arrow.addEventListener("click", toggleNode);
        arrow.appendChild(createDomElement("span", "", "glyphicon glyphicon-chevron-down"));
        li.firstElementChild.insertBefore(arrow, li.firstElementChild.childNodes[0]);
    };

    var generateHtmlTree = function(array) {
        var ol = createDomElement("ul", "", "ui-tree-nodes");
        array.forEach(function(item) {
            var li = generateTreeNode(item);
            
            if (typeof item.items === "object" && item.items.length > 0) {
                insertHtmlArrow(li);
                li.appendChild(generateHtmlTree(item.items));
            } else {
                li.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
            }
            
            ol.appendChild(li);
        });
        return ol;
     };

    var generateJsonTree = function(node) {
        if (!node) {
            return [];
        }
      //  console.log(node);
        node = node.firstElementChild;
       // console.log('second');
       // console.log(node);
        var jsonArr = [];
        while (node) {
            if (node.tagName.toLowerCase() === "div") {
                var json;
                //console.log((+node.getAttribute("path")));
               // var element = node.parentElement;
               // console.log((+element.getAttribute("id")))
                json = {
                    id: (+node.getAttribute("id")),
                    title: node.getElementsByClassName('text-edit')[0].innerText,
                };
                // var temp=json.id;
                // var str= [];
                // while(temp!=0){
                //     var mod = temp%10;
                //     temp/=10;
                //     allnodes.forEach(nodesItem => {
                //         if(nodesItem.id == mod){
                //             str.push(nodesItem.title);
                //         }
                //     });
                // }
                // var str1= str.reverse();
                // var s="";
                // str1.forEach(word => {
                //     s+='/'+word;
                // });
                // console.log(s);
                // json.path = s;
                 json.items = generateJsonTree(node.nextElementSibling);
                jsonArr.push(json);
                return jsonArr;
            } else {
                // add all the chilNodes to the array
                [].push.apply(jsonArr, generateJsonTree(node));
            }

            node = node.nextElementSibling;
        }
        return jsonArr;
    };

    var generateJson = function(id) {
      //  console.log(id);
        return {
            id: 1,
            items: generateJsonTree(document.getElementById(id))
        };
    };

    var setUiTree = function(json) {
        var root = document.getElementById("tree-root");
        root.innerHTML = "";
        var tree = generateHtmlTree(json.items);
        root.appendChild(tree);
    };
    var createDomElement = function(tag, id, elementClass, propertiesOrEvents) {
        var element = document.createElement(tag);
        if (id) {
            element.setAttribute("id", id);
        }
        if (elementClass) {
            element.setAttribute("class", elementClass);
        }
        if (propertiesOrEvents) {
            for (var key in propertiesOrEvents) {
                if (propertiesOrEvents.hasOwnProperty(key)) {
                    element.setAttribute(key, propertiesOrEvents[key]);
                }
            }
        }
        return element;
    };


    /***********************  drag and drop **************************/
    var originalObject = null;
    var dragObject = null;
    var dragObjectParent = null;
    var treeRoot = document.getElementById("tree-root");
    var mousePos = {x:0, y:0};
    var placeHolder = createDomElement("li", "", "ui-tree-placeholder");
    var curTarget = null;
    var lastTarget = null;
    var appendToEnd = false;
    var appendToTop = false;
    var dragHelper = null;
    var dragging = false;
    var draggables = [];
    var curOffset;
    var editElement = false;
    var previousSibling = null;
    var nextSibling = null;

    var mouseCoords = function(e) {
        return {
            x: document.all ? window.event.clientX : e.pageX ,
            y: document.all ? window.event.clientY : e.pageY
        }
    }

    var resetDraggables = function(){
        draggables = treeRoot.getElementsByClassName("ui-tree-handle");
    }

    var addPlaceHolder = function(){  
        placeHolder.style.height = window.getComputedStyle(dragObject, null).height;          
        
        if(appendToEnd){
            treeRoot.firstChild.appendChild(placeHolder);
        }else if(appendToTop && treeRoot.firstChild.firstElementChild) {
            treeRoot.firstChild.insertBefore(placeHolder, treeRoot.firstChild.firstElementChild);
        }else {
            
            placeHolder.style.width = window.getComputedStyle(curTarget, null).width;
            curTarget.nextSibling.appendChild(placeHolder);
        }
        
    };

    var removePlaceHolder = function(){
        placeHolder.parentElement.removeChild(placeHolder);
    };

    var mouseMove = function(ev) {
        ev = ev || window.event;
        mousePos = mouseCoords(ev);
        if (dragging) {
            curTarget = null;
            for(var i = 0; i < draggables.length; i++){
                var bounds = draggables[i].getBoundingClientRect();
                if ( draggables[i].parentElement !== dragObject &&
                    (ev.clientX >= bounds.left && ev.clientX <= bounds.right) &&
                    (ev.clientY >= bounds.top - 4 && ev.clientY <= bounds.bottom + 5) ) {
                        curTarget = draggables[i];
                        break;
                }
            }
            if(!curTarget){
                 var rootRect = treeRoot.getBoundingClientRect();
                 if (ev.clientX >= rootRect.left && ev.clientX <= rootRect.right){
                     var offSetPlaceHolder = !!placeHolder.parentElement ? parseInt(window.getComputedStyle(placeHolder, null).height) : 0;
                     appendToEnd = (ev.clientY + offSetPlaceHolder >= rootRect.bottom   && ev.clientY <= rootRect.bottom  + 120 + offSetPlaceHolder);

                     if(!appendToEnd){
                         appendToTop = (ev.clientY >= rootRect.top - 120 - offSetPlaceHolder  && ev.clientY - offSetPlaceHolder <= rootRect.top);
                     }
                 }

                 if(placeHolder.parentElement && placeHolder.parentElement.parentElement !== treeRoot){
                     removePlaceHolder();
                 }                      
            }
            if(curTarget || (appendToEnd || appendToTop) && !placeHolder.parentElement){
                addPlaceHolder();
            }
            dragObject.style.top = (mousePos.y - curOffset.top) + 'px';
            dragObject.style.left = (mousePos.x - curOffset.left) + 'px';
            return false;
        }
    }
    
    var resetlisteners = function(element, elementClass, event, fn){
        var temp = element.getElementsByClassName(elementClass);
        for(var i = 0; i < temp.length; i++){
            temp[i].addEventListener(event, fn);
        }
        return temp;
    }

    var resetButtonListeners = function(element){
        resetlisteners(element, 'remove-btn', 'click', removeTreeNode);
        resetlisteners(element, 'new-item-btn', 'click',newNode);
        resetlisteners(element, 'toogle-btn', 'click',toggleNode);
        resetlisteners(element, 'text-edit', 'dblclick', nodeEditText);
    }
        
    var mouseUp = function(ev) {
        if(dragging){
            ev = ev || window.event;
            var mousePos = mouseCoords(ev);
            if(placeHolder.parentElement){
                removePlaceHolder();
            }
            if(curTarget && curTarget !== dragObject.parentElement.previousElementSibling){      
                curTarget.nextSibling.appendChild(originalObject);
                if(curTarget.nextSibling.childElementCount === 1){
                    insertHtmlArrow(curTarget.parentElement);
                }                                      
            } else if (appendToEnd){
                treeRoot.firstChild.appendChild(originalObject);
            } else if (appendToTop){
                treeRoot.firstChild.insertBefore(originalObject, treeRoot.firstChild.firstElementChild);
            } else {
                if(nextSibling){
                    dragObjectParent.insertBefore(originalObject, nextSibling);
                } else {
                    dragObjectParent.appendChild(originalObject);
                }
            }
            if(dragObject.parentElement.parentElement !== treeRoot && dragObject.parentElement.childNodes.length === 1){
                var firstChild = dragObject.parentElement.previousElementSibling.firstElementChild;
                firstChild.parentNode.removeChild(firstChild);
            }
            dragObject.parentNode.removeChild(dragObject);
            resetButtonListeners(originalObject);
            setDraggables(originalObject);
            dragging = false;
            dragObject = null;
            appendToEnd = false;
            appendToTop = false;
            nextSibling = null;
            displayJson(generateJson("tree-root"));
        } else {
            clearTimeout(dragHelper);
        }
    }

    var enableDrag = function(){
        if(dragObject && !editElement){
            originalObject = dragObject.cloneNode(true);
            nextSibling = dragObject.nextElementSibling;
            dragObject.style.width = window.getComputedStyle(dragObject, null).width;
            dragObject.style.zIndex = 9999;
            dragObject.style.position = 'absolute';
            dragging = true;
        }
    };

    var makeDraggable = function (item) {
        if (!item) return;
        item.onmousedown = function() {
            dragObject = this.parentElement;
            dragObjectParent = dragObject.parentElement;
            curOffset = {top: mousePos.y - dragObject.offsetTop, left: mousePos.x - dragObject.offsetLeft };
            dragHelper = setTimeout(enableDrag, 200);
        };
    };

    

    var setDraggables = function(element){
        var temp = element.getElementsByClassName("ui-tree-handle");
        for (var i = 0; i < temp.length; i++) {
            makeDraggable(temp[i]);
        }
        return temp;
    };

    var dragDrop = function() {
        window.onmousemove = mouseMove;
        window.onmouseup = mouseUp;
        draggables  = setDraggables(treeRoot);
    };

    var displayJson = function(json) {
        var test = JSON.stringify(json, null, 2);
        var displayJson = document.getElementById("json-code");
        displayJson.innerText = test;
    };

     
     var getJson = function(){
        return generateJson("tree-root")
     }

     var initUiTree = function(json){
         setUiTree(json);
         dragDrop();
         displayJson(getJson());
     }

     var addNode = function(id, title){
         var rootChildCount = treeRoot.firstElementChild.childElementCount;
         id = id || rootChildCount + 11;
         title = title || 'Node1.' + (rootChildCount + 1);
         var node = generateTreeNode({id: id, title: title}); 
         node.appendChild(createDomElement("ul", "", "ui-tree-nodes"));
         setDraggables(node);
         treeRoot.firstElementChild.appendChild(node);
         resetDraggables();

         displayJson(getJson());
           
         return node;    
     }

     if(dataJson){
         initUiTree(dataJson);
     }

    (function(){
        var btnNewNode = document.getElementById("new-node");
        if(btnNewNode){
            btnNewNode.addEventListener('click', function(){
                tree.addNode();
            });
        }
    })();

    return {
        addNode: addNode, //add new node to the tree
        getData: getJson, // returns the a json with the node tree
        setData: initUiTree // initializes the tree   
    }
};

//********************************************//

var tree;
// Starting point
document.addEventListener("DOMContentLoaded", function(event) {   
    tree = moduleUiTree(data);
   // console.log(tree.getData());
    //console.log(tree.addNode(333, "I'm a test"));
});



/******************* test data *****************************/
var data = {
    "id": 1,
    "items": [{
        "id": 11,
        "title": "Node1.1",
        "items": [{
            "id": 111,
            "title": "Node1.1.1",
            "items": [

            ]
        }, {
            "id": 112,
            "title": "Node1.1.2",   
            "items": [

            ]
        }, {
            "id": 113,
            "title": "Node1.1.3",   
            "items": []
        }]
    }]
};
