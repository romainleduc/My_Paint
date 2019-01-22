window.onload = function(e)
{
    //global composite oppertation

    //Get Elements DOM

    var body = document.getElementById("group-canvas");
    var canvas = document.getElementById("my_paint");
    var context = canvas.getContext("2d");
    var panelColor = document.getElementById("panel-color");
    panelColor.value = "#ffffff";
    var selectSize = document.getElementById("select-size");

    var layers = [];

    var bBackgroundColorCircle = false;
    var bBackgroundColorRectangle = false;

    var bDragging = false;
    var radius = 0;

    var bOnCheckbox = false;

    //Remis a 0 quand le nombre de clique arrive à 2
    var clicked = 0;

    //Stock les positions de la souris au moment du clique
    var posStart = [];
    var posEnd = [];

    var bSymetrie = false;

    var options =  {
        "bLine" : 0,
        "bBrush" : 1,
        "bCircle": 0,
        "bRubber" : 0,
        "bRectangle" : 0
    };

    //Initialise les evenements à un canvas
    function initEventCanvas(theCanvas)
    {
        theCanvas.addEventListener('mouseup', function(e)
        {
            if (bSymetrie) initMirror();
        
            colorBrush = panelColor.value;
        
            bDragging = false;
        
            drawRectangle(e);
            drawLine(e);
            drawCircle(e);
        });
        
        theCanvas.addEventListener('mousemove', function(e)
        {
            if (bSymetrie) initMirror();
        
            colorBrush = panelColor.value;
        
            putPoint(e);
        });
        
        theCanvas.addEventListener('mousedown', function(e)
        {
            if (bSymetrie) initMirror();
        
            colorBrush = panelColor.value;
        
            bDragging = true;
            context.moveTo(e.offsetX, e.offsetY);
        });
    }

    function changeContext(newContext)
    {    
        context = newContext;
    }

    var colorBrush = panelColor.value;

    addLayer("Background");

    //Initialise les evenements au canvas
    initEventCanvas(canvas);



    //Les bouttons

    //Active le crayon
    var crayon = document.getElementById("crayon");
    crayon.addEventListener('click', function(e)
    {   
        for (var key in options)
        {
            options[key] = 0;
        }

        options['bBrush'] = 1;    
    });

    //Active le tracé
    var line = document.getElementById("line");
    line.addEventListener('click', function(e)
    {
        for (var key in options)
        {
            options[key] = 0;
        }

        options['bLine'] = 1;
        
    });

    //Active le rectangle
    var rectangle = document.getElementById("rectangle");
    rectangle.addEventListener('click', function(e)
    {
        for (var key in options)
        {
            options[key] = 0;
        }

        options['bRectangle'] = 1;
    });

    //Active le cercle
    var circle = document.getElementById("circle");
    circle.addEventListener('click', function(e)
    {
        for (var key in options)
        {
            options[key] = 0;
        }

        options['bCircle'] = 1;

    });

    //Active la gomme
    var rubber = document.getElementById("rubber");
    rubber.addEventListener('click', function(e)
    {
        for (var key in options)
        {
            options[key] = 0;
        }

        options['bRubber'] = 1;
        
    });

    //Active ou desactive la symetrie
    var symetrie = document.getElementById('symetrie');
    symetrie.addEventListener('click', function()
    {
        bSymetrie = !bSymetrie;

        if(bSymetrie)
        {
            addLayer("Thetest");
            //initMirror();   
        }
    });

    //Affiche le choix du nom pour le calque
    var buttonAddLayer = document.getElementById('add-layer');
    buttonAddLayer.addEventListener('click', function()
    {
        var test = document.getElementById('tututu');
        var layerName = document.getElementById('layer-name');
        
        test.style.display = '';
        layerName.style.display = '';
    });


    var theAddLayer = document.getElementById('add');
    theAddLayer.addEventListener('click', function()
    {
        var inputLayer = document.getElementById('input-layer');
        
        if(addLayer(inputLayer.value))
        {
            var layerName = document.getElementById('layer-name');
            layerName.style.display = 'none';

            var test = document.getElementById('tututu');
            test.style.display = 'none';
        }
    });

    var SaveSymetrie = document.getElementById('save-symetrie');
    SaveSymetrie.addEventListener('click', function()
    {
        var tabCanvas = [];

        if(bSymetrie)
        {
            for(var i in body.childNodes)
            {
                if(body.childNodes[i].nodeName == "CANVAS")
                {
                    tabCanvas.push(body.childNodes[i]);
                }
            }
        }

        if(tabCanvas.length == 2)
        {
            mergeCanvas(tabCanvas[0], tabCanvas[1]);
            bSymetrie = false;
        }
    });

    var putPoint = function(e)
    {
        if(bDragging && options['bBrush'] || bDragging && options['bRubber'])
        {
            if(options['bRubber']) colorBrush = "rgba(0, 0, 0)";
            context.strokeStyle = colorBrush;
            context.lineTo(e.offsetX, e.offsetY);
            context.lineWidth = selectSize.value;
            context.stroke();
            context.beginPath();
            context.lineCap = "round";
            context.moveTo(e.offsetX, e.offsetY);
        }
    }

    var drawLine = function(e)
    {
        if(options["bLine"] == 1 && saveClicked(e) == 2)
        {
            context.beginPath();
            context.strokeStyle = colorBrush;
            context.moveTo(posStart[0], posStart[1]);
            context.lineTo(posEnd[0], posEnd[1]);
            context.lineWidth = selectSize.value;
            context.stroke();
            clicked = 0;
        }
    }

    var backgroundRectangle = document.getElementById("background-rectangle");
    backgroundRectangle.addEventListener('click', function(e)
    {
        bBackgroundColorRectangle = !bBackgroundColorRectangle;
    });

    var drawRectangle = function(e)
    {
        if(options['bRectangle'] == 1 && saveClicked(e) == 2)
        {
            context.beginPath();

            if(bBackgroundColorRectangle)
            {
                context.fillStyle = colorBrush;
                context.fillRect(posStart[0], posStart[1], posEnd[0] - posStart[0], posEnd[1] - posStart[1]);
                context.lineWidth = selectSize.value;
                context.fill();
            }
            else
            {
                context.strokeStyle = colorBrush;
                context.strokeRect(posStart[0], posStart[1], posEnd[0] - posStart[0], posEnd[1] - posStart[1]);
                context.lineWidth = selectSize.value;
                context.stroke();
            }
            clicked = 0;
        }
    }

    //Circle

    var backgroundCircle = document.getElementById("background-circle");
    backgroundCircle.addEventListener('click', function(e)
    {
        bBackgroundColorCircle = !bBackgroundColorCircle;
    });


    var drawCircle = function(e)
    {
        if(options["bCircle"] == 1 && saveClicked(e) == 2)
        {
            var width = Math.abs((posStart[0] /4) - (posEnd[0] /4));
            var height = Math.abs((posStart[1] /4) - (posEnd[1] / 4));
            var result = (width + height);

            context.beginPath();

            if(bBackgroundColorCircle)
            {
                context.fillStyle = colorBrush;
                context.arc(posStart[0],posStart[1],result*Math.PI,0,2*Math.PI);
                context.lineWidth = selectSize.value;
                context.fill();
            }
            else
            {
                context.strokeStyle = colorBrush;
                context.arc(posStart[0],posStart[1],result*Math.PI,0,2*Math.PI);
                context.lineWidth = selectSize.value;
                context.stroke();
            }
            clicked = 0;
        }
    }

    var saveClicked = function(e)
    {
        switch(clicked)
        {
            case 0:
            posStart[0] = e.offsetX;
            posStart[1] = e.offsetY;
            clicked++
            break;

            case 1:
            posEnd[0] = e.offsetX;
            posEnd[1] = e.offsetY;
            clicked++;
            break;
        }

        return clicked;
    }

    // window.addEventListener('keypress', function()
    // {
    //     var layer = document.getElementsByClassName('layer');

    //     for(var i = 0; i < layer.length; i++)
    //     {
    //         if(layer[i].style.backgroundColor == 'green')
    //         {
    //             test = document.getElementById(layer[i].childNodes[0].innerHTML);
    //             layer[i].remove();
    //             test.remove();
    //         }
    //     }
    // });

    function createLayer()
    {
        var theCloneCanvas = cloneCanvas(canvas);
        theCloneCanvas.getContext('2d').clearRect(0,0,theCloneCanvas.width,theCloneCanvas.height);

        theCloneCanvas.style.position = 'absolute';
        theCloneCanvas.style.left = "8px";
        theCloneCanvas.style.backgroundColor = "transparent";
        theCloneCanvas.style.opacity = 1;

        return theCloneCanvas;
    }

    function between(value, min, max) {
        return (value < min || value > max) ? false : true;
    }

    function addLayer(layerName)
    {
        if(!between(layerName.length, 3, 15) || keyExist(layers, layerName))
            return false;
            
        layers[layerName] = createLayer();
        layers[layerName].id = layerName;

        body.appendChild(layers[layerName]);

        initEventCanvas(layers[layerName]);
        changeContext(layers[layerName].getContext('2d'));

        var groupLayers = document.getElementById('group-layers');
        groupLayers.appendChild(addLayerInBox(layerName));

        return true;
    }

    function addLayerInBox(layerName)
    {
        if(keyExist(layers, layerName))
        {
            var layer = document.createElement('div');
            layer.className = "layer";

            var layerNameText = document.createElement('p');
            layerNameText.innerHTML = layerName;
            layer.appendChild(layerNameText);

            var layerInput = document.createElement('input');
            layerInput.type = "checkbox";
            layerInput.checked = true;
            layerInput.addEventListener('click', function()
            {
                checkActiveLayer(layerInput, layerNameText.innerHTML);
            });

            layerInput.addEventListener('mouseover', function()
            {
                bOnCheckbox = true;
            });

            layerInput.addEventListener('mouseleave', function()
            {
                bOnCheckbox = false;
            });


            layer.addEventListener('click', function(e)
            {
                if(bOnCheckbox) return;

                var test = document.getElementsByClassName('layer');

                for(var i = 0; i < test.length; i++)
                    test[i].style.backgroundColor = "white";            

                changeContext(layers[layerName].getContext('2d'));
                layer.style.backgroundColor = '#C2B88A';
            });

            layer.appendChild(layerInput);

            return layer;
        }
    }

    function checkActiveLayer(layerInput, layerNameText)
    {
        switch(layerInput.checked)
        {
            case true:
            document.getElementById(layerNameText).style.display = '';
            break;

            case false:
            document.getElementById(layerNameText).style.display = 'none';
            break;
        }
    }

    function cloneCanvas(theCanvas)
    {
        var cloneCanvas = document.createElement('canvas');
        var theContext = cloneCanvas.getContext('2d');

        cloneCanvas.width = theCanvas.width;
        cloneCanvas.height = theCanvas.height;

        theContext.save();
        theContext.drawImage(theCanvas, 0, 0);
        theContext.restore();

        return cloneCanvas;
    }

    function diviseCanvas()
    {
        var diviseCanvas = document.createElement('canvas');
        var theContext = diviseCanvas.getContext('2d');

        var theCloneCanvas = cloneCanvas(canvas);
        canvas.width = canvas.width / 2;

        diviseCanvas.width = canvas.width;
        diviseCanvas.height = canvas.height;

        theContext.save();
        theContext.drawImage(theCloneCanvas, -600, 0);
        context.drawImage(theCloneCanvas, 0,0);
        theContext.restore();

        body.appendChild(diviseCanvas);
    }

    function mirrorCanvas(oldCanvas)
    {
        var newCanvas = document.createElement('canvas');
        var theContext = newCanvas.getContext('2d');

        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        theContext.save();
        theContext.scale(-1,1);
        theContext.translate(-600,0);
        theContext.drawImage(oldCanvas, 0, 0);
        theContext.restore();

        return newCanvas;
    }

    function initMirror()
    {

        //body.removeChild(body.lastChild);
        //body.appendChild(canvasClone);
    }

    function mergeCanvas(canvas1, canvas2)
    {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        initEventCanvas();

        canvas.width = canvas1.width + canvas2.width;
        canvas.height = canvas1.height;

        context.save();
        context.drawImage(canvas1, 0, 0);
        context.drawImage(canvas2, canvas.width / 2, 0);
        context.restore();

        canvas1.remove();
        canvas2.remove();

        body.appendChild(canvas);
    }

    function keyExist(object, objectName)
    {
        if(Object.keys(object) == 0) return false;

        for(var key in object)
        {
            if(key == objectName) return true;
        }

        return false;
    }
}