
// ******************************************************************************
// ********************************* Var Globales ******************************* 
// ******************************************************************************
 

var pcOnCnt  = 0;
var pcOffCnt = 0;
var cntIP    = 0;

var pcOnArray   = [];
var pcOffArray  = [];
var pcOnArray2  = [];
var pcOffArray2 = [];

var pcNameArray   = [];
var macAddrArray  = [];
var ipAddrArray   = [];
var namePcModules = [];

var dataValueModulesArray = [];
var auxArrayData   = [];  
var filesArray     = [];
var filesArrayName = [];

var controlEnterFunction = true;
var auxNamePCdata        = true;
var controlChDial        = false;
var errorTurnOnModule    = false;
var getStatusModuleOn    = false;
var getStatusModuleOff   = false;

//var deviceMobile = "";  
var configModulo;   
var totalNumerProjectors;     
var configProjector;  
var configPc;         
var configPuerto;
var ipMainServer;
var hostnameServer;

var socket = io();

// ******************************************************************************
// ************************ Eventos al cargar al documento ************************* 
// ******************************************************************************

$(document).ready(function(){
console.log($( window ).width())
console.log($( document ).width())
  
var widthInit  =  window.innerWidth;
var heightInit =  window.innerHeight;

var checkECA1 = true;
$("#btnECA1").click(function(){
    console.log(checkECA1)
    if (checkECA1) {
      console.log("checked")
      $('#ECA1').prop('checked', true);
      checkECA1 = false;
    }else{
      console.log("No checked")
      $('#ECA1').prop('checked', false);
      checkECA1 = true;
    };
  });

var checkECA2 = true;
$("#btnECA2").click(function(){
    console.log(checkECA2)
    if (checkECA2) {
      console.log("checked")
      $('#ECA2').prop('checked', true);
      checkECA2 = false;
    }else{
      console.log("No checked")
      $('#ECA2').prop('checked', false);
      checkECA2 = true;
    };
  });

var checkECA3 = true;
$("#btnECA3").click(function(){
    console.log(checkECA3)
    if (checkECA3) {
      console.log("checked")
      $('#ECA3').prop('checked', true);
      checkECA3 = false;
    }else{
      console.log("No checked")
      $('#ECA3').prop('checked', false);
      checkECA3 = true;
    };
  });

var checkECA4 = true;
$("#btnECA4").click(function(){
    console.log(checkECA4)
    if (checkECA4) {
      console.log("checked")
      $('#ECA4').prop('checked', true);
      checkECA4 = false;
    }else{
      console.log("No checked")
      $('#ECA4').prop('checked', false);
      checkECA4 = true;
    };
  });


$("#fileInput").hide();
$("#subirArchivoBtn").click(function(){
  $("#fileInput").trigger('click');
});

//*** Envío de petición/solicitud para APAGAR computadora seleccionada 

  $("#powerOffPC").click(function(){
    var pruebaPc = $("#controlPCs").serialize();
    var auxpcName = pruebaPc.split('=');
    
    $.ajax({
      url: "/TurnOffPC",
      data: {pcName:auxpcName[1]}
    }).done(function(result){

      });
  });

//*** Envío de petición/solicitud para ENCENDER computadora seleccionada 

  $("#powerOnPC").click(function(){
    var pruebaPc = $("#controlPCs").serialize();
    var auxpcName = pruebaPc.split('=');

    for (var i = pcNameArray.length - 1; i >= 0; i--) {      
      if (pcNameArray[i] == auxpcName[1]) { 
        PC_ON(pcNameArray[i], ipAddrArray[i], macAddrArray[i]);
        break;
      };
    };
  });

  
//*** Botón aceptar "Ok" en cuadro de diálogo después de que un archivo fue subido 
//    correctamente al servidor (sección "Archivos")

  $("#fileSentOk").on("click",function(){

    setTimeout(function(){ 
        $('#displayFile').text("-");
        $('#fileInput').text("");
        $('#hUPFile').text("Subir Archivo");
        $("#fileOkUp").hide();
        $("#fileSent").show();
        $("#fileSentOk").hide();
        $("#diaplyPOPup").show();
        $("#displayFile").show();
        $("#fileInput").show();
        $("#successIconUpF").hide();
      },1000); 
  });


//*** Uso de los módulos/packages "socket.io" y "delivery" (https://www.npmjs.com/package/delivery)(http://socket.io/) 
//    principalemnte para envío de archivos al servidor. 
//    Socket.io abre un canal de comunicación bidireccional "permanente" entre el cliente y el servidor
  
  $.ajax({
    url: "/whatIsYourIP"
    }).done(function(result){
       ipMainServer   = result;
       console.log(ipMainServer);
  }).then(function(data){

    $(function(){
      $("#fileSentOk").hide();
      $("#fileOkUp").hide();
      $("#successIconUpF").hide();
      $("#noFileSelected").hide();

      var socket = io.connect(ipMainServer+':3000'); //Conexión con el servidor
      
      socket.on('connect', function(){

        var delivery = new Delivery(socket); //Creamos objeto "delivery" y asociamos al socket

        delivery.on('delivery.connect',function(delivery){

          $("#fileSent").click(function(evt){
            var file = $("#fileInput")[0].files[0];

            var extraParams = {foo: 'bar'};
            delivery.send(file, extraParams);
            evt.preventDefault();
            
          });
        });

        // Si el archivo se envió correctamente:
        delivery.on('send.success',function(fileUID){
          $("#loadIconSendFile").hide();
          $("#fileSent").hide()
          $("#fileSentOk").show()
          $("#diaplyPOPup").hide()
          $("#displayFile").hide()
          $("#fileOkUp").show()
          $("#fileInput").hide()
          $("#successIconUpF").attr("src","images/success.svg")
          $("#successIconUpF").show()
          $("#hUPFile").text("Correcto");

          // Peticicón al servidor para leer archivos actuales en el sistema y crear los botones correspondiente
          $.ajax({ 
            url: "/readContentFile"
            }).done(function(result){
              console.log('asd',$("#fileInput")[0].files[0].name)
              var thereAreFiles = false;
              var filesData = result.split(":");
              for (var i = filesData.length - 1; i >= 0; i--) {
                console.log(filesData[i])
                if ((filesData[i] == ".DS_Store") || (filesData[i] == "desktop.ini") || (filesData[i] == "")) {
                  continue
               };
                if ((filesData[i] == $("#fileInput")[0].files[0].name)) {
                  thereAreFiles = true;
                  $("#displayFiles").append('<div><a id=files'+filesArray.length+' class="ui-btn">'+filesData[i]+' </a></div>').enhanceWithin();
                  $("#displayDownloads").append('<a href="/downloadFiles?file='+filesData[i]+'" target="_self" class="ui-btn ui-icon-download-interface-symbol ui-corner-all ui-shadow ">'+filesData[i]+'</a>').enhanceWithin();
                  filesArrayName.push(filesData[i]);
                };
 
              };
              if (thereAreFiles) {
                $('#textDisplayFiles').text("");
                $('#textDisplayFiles2').text("");
                $('#textDisplayFilesDL').text("");
                $('#textDisplayFilesDL2').text("");
              };
            }).then(function(data){
              filesArray.push('files'+filesArray.length)
              console.log(filesArray)
              console.log(filesArrayName)
              
            })
        });

        //Error de envío de archivo
        delivery.on('error', function(e) {
          $("#sendFileToServer").popup( "open" );
          $('#fileH1').text("Error");
          $('#fileH2').text("El archivo no pudo ser enviado!");
        });


      });
    });

  });

//*** Botón para para selección de archivo a subir al servidor (choose file)
//    Mostrar nombre de archivo seleccionado

  $("#fileInput").change(function() {
     var filenNombre = $("#fileInput")[0].files[0];
     $('#displayFile').text(filenNombre.name);

  });

//*** Clic en botón "Subir" para envío de archivo seleccionado al servidor 
//    Si no se ha seleccionado archivo y se presionó botón "Subir", se notifica al usuario

  $("#fileSent").click(function(){

    if ($("#fileInput")[0].files[0] == undefined) {
      $("#noFileSelected").show();

        setTimeout(function(){ 
          $("#noFileSelected").fadeOut();
        }, 1000);

    }else{
      $("#loadIconSendFile").show();
      $("#loadIconSendFile").attr("src","images/loadIcon3.svg");
    };

  });
 
  
//*** Función que detecta cada/todo evento clic de la clase .ui-btn dentro del documento 
//    Esta función se utiliza para detectar id de elementos (botones) que son creados en tiempo de ejecución

  $(function() {

    $(document).on("click", '.ui-btn', function() {

      for (var i = filesArray.length - 1; i >= 0; i--) { 
        if (filesArray[i] == event.target.id) { 
          console.log("Id:     ",event.target.id);
          startfile(filesArrayName[i]);
          break;
        };
      };

      //console.log(event.target.id)
      for (var i = totalNumerProjectors-1; i >= 0; i--) {
        if (event.target.id == "editBtnProj"+i) {
          console.log(event.target.id)

          $("#proyectorNameEdit").val($("#valMarca"+i+"").text()+"-"+$("#valModelo"+i+"").text())
          $("#onCmdEdit").val($("#valonCmd"+i+"").text())
          $("#offCmdEdit").val($("#valoffCmd"+i+"").text())
          $("#onAckCmdEdit").val($("#valonAckCmd"+i+"").text())
          $("#offAckCmdEdit").val($("#valoffAckCmd"+i+"").text())
          $("#baudRateEdit").val($("#valbaudRate"+i+"").text())
        };
      };

      for (var i = pcNameArray.length - 1; i >= 0; i--) {
        if (pcNameArray[i] == event.target.id) { 
          console.log("Id:     ",event.target.id);
          PC_ON(pcNameArray[i], ipAddrArray[i], macAddrArray[i]);
          break;
        };
      };    
    }); 
  });


//*** Configuración de módulos. Asignar a cada módulo una PC, Proyector y Puerto

  $("#establecerECAMural").click(function(){
    var auxControl = false;

    //Formato de valor de cada modulo --> [modulo,proyector,computadora,puerto]
    configModulo     = $("#Eca_Mural").val();
    configProjector  = $("#selectProjector").val();
    configPc         = $("#selectPC").val();
    configPuerto     = $("#selectPort").val();

    dataValueModulesArray[0] = $("#Mural").val();
    dataValueModulesArray[1] = $("#ECA1").val();
    dataValueModulesArray[2] = $("#ECA2").val();
    dataValueModulesArray[3] = $("#ECA3").val();
    dataValueModulesArray[4] = $("#ECA4").val();

    console.log("Valores a configurar:")
    console.log("Modulo    = ",configModulo);
    console.log("Proyector = ",configProjector);
    console.log("PC        = ",configPc);
    console.log("Puerto    = ",configPuerto);

    //dataValueModulesArray = [dataMural, dataECA1, dataECA2, dataECA3, dataECA4]
    var dataSatusMural = dataValueModulesArray[0].split('_');
    var dataSatusECA1  = dataValueModulesArray[1].split('_');
    var dataSatusECA2  = dataValueModulesArray[2].split('_');
    var dataSatusECA3  = dataValueModulesArray[3].split('_');
    var dataSatusECA4  = dataValueModulesArray[4].split('_'); 
    auxArrayData       = [dataSatusMural, dataSatusECA1, dataSatusECA2, dataSatusECA3, dataSatusECA4];

   
    console.log("Valores actuales de cada modulo = ",dataValueModulesArray)
    
    // Ver si el módulo seleccionado se le asigna el puerto que ya tenía previamente
    for (var i = dataValueModulesArray.length - 1; i >= 0; i--) {
      if ((configPuerto == auxArrayData[i][3]) && (configModulo == auxArrayData[i][0])) {
        auxControl = true;
      };
    };

    // Condición para asignar un solo puerto por módulo e intercambiar posición de puertos por si el puerto que se eligió ya está ocupado
    if(((configPuerto == dataSatusMural[3]) || (configPuerto == dataSatusECA1[3]) ||
        (configPuerto == dataSatusECA2[3])  || (configPuerto == dataSatusECA3[3]) || 
        (configPuerto == dataSatusECA4[3])) && !auxControl){
      $("#configECA3").text("Alerta"); 
      $("#configECA4").text("El puerto selecciondo ya está asignado a otro módulo."+"\n"+"Deseas continuar con la configuración?"); 
      
    }else{
      $("#configECA3").text("Alerta"); 
      $("#configECA4").text("Deseas continuar con la configuración?"); 
    };

  });





///*** Confirmación de configuración de módulos

  $("#sbmitBtnEca_Mural").click(function(){

    var noConfigModulesOn = false;
    var Names = ["Módulo:  ", "Proyector:  ", "Computadora:  ", "Puerto:  "];

    $.ajax({
      url: "/configureMuralEca",
      data: {modulo:configModulo, projector:configProjector, pc:configPc, puerto:configPuerto}
    }).done(function(result){
      var response = result.split("_");
      if (response[1] == "1") {
        $.ajax({
          url: "/getValueForModules"
          }).done(function(result){
            $("#Mural").val(result.Values[0].modulo+"_"+result.Values[0].proyector+"_"+result.Values[0].pc+"_"+result.Values[0].puerto)
            $("#ECA1").val(result.Values[1].modulo+"_"+result.Values[1].proyector+"_"+result.Values[1].pc+"_"+result.Values[1].puerto );
            $("#ECA2").val(result.Values[2].modulo+"_"+result.Values[2].proyector+"_"+result.Values[2].pc+"_"+result.Values[2].puerto);
            $("#ECA3").val(result.Values[3].modulo+"_"+result.Values[3].proyector+"_"+result.Values[3].pc+"_"+result.Values[3].puerto);
            $("#ECA4").val(result.Values[4].modulo+"_"+result.Values[4].proyector+"_"+result.Values[4].pc +"_"+result.Values[4].puerto);
            
            $("#mod").text("");
            $("#pro").text("");
            $("#ppcc").text("");
            $("#prto").text("");

            for (var i = result.Values.length-1; i >= 0; i--) {
              $("#"+result.Values[i].modulo+"t").remove();
              $("#currentConfigModulesTable").append(' <tbody id="'+result.Values[i].modulo+'t"> <tr><td><b>'+Names[0]+'</b>'+result.Values[i].modulo+'</td> <td><b>'+Names[1]+'</b>'+result.Values[i].proyector+'</td> \
                                          <td><b>'+Names[2]+'</b>'+result.Values[i].pc+'</td> <td><b>'+Names[3]+'</b>'+result.Values[i].puerto+'</td></tr></tbody> ').enhanceWithin();
              namePcModules[i] = result.Values[i].modulo+"_"+result.Values[i].pc;
            };

        });

        $("#configECA").text("Correcto");
        $("#configECA2").text("Se ha configurado '"+response[0]+"' correctamente!");

      }else{
        document.getElementById("configECA").innerHTML   = "Error";
        document.getElementById("configECA2").innerHTML  = "No se logró configurar '"+response[0]+"'!";
      };
    });
  });
    

//*** validación de datos ingresados por el usuario para agregar una PC  
//    Data from page: Add Computer, Data: Name & MacAddress

  $("#ADDPC").click(function(){
      var namePC  = document.getElementById("namePC").value; 
      var MACaddr = document.getElementById("MACaddr").value;
      var dirIP   = document.getElementById("dirIP").value;

      var j = 2;
      var k = 0;
      var position, position2;
      var validName  = 0;
      var validName2 = false;
      var validNameSpace = true;
      
      var validateIP = 0;
      var currentNum = 0;
      var pointNum   = 0;
      var validHexFF = 0;
      var factorMult = 1;
      var errorIPnum  = false;
      var errorIPnum2 = false;
      var isValidIP   = true; 

    //****** Validar datos entregados por el usuario

      //Validar nombre
      for (var i = namePC.length - 1; i >= 0; i--) {
        if ((namePC[i]>='A' && namePC[i]<='Z') || (namePC[i]>='a' && namePC[i]<='z') || (namePC[i] >= 0 && namePC[i] <= 9)){
          validName += 1;
        };
        if (validName == namePC.length){ 
          validName2 = true; 
        };
        if (namePC[i] == " ") {
          validNameSpace = false;
        };
      };

      //Validar dirección IP
      if ((dirIP[dirIP.length - 1] == '.') || dirIP == '') {
        isValidIP = false;
        document.getElementById("ValidData").innerHTML  = "Error: Dir. IP";
        document.getElementById("ValidData1").innerHTML = "Secuencia no válida!";
      }else{

        for (var i = dirIP.length - 1; i >= 0; i--) {

          if ((dirIP[i] >= 0 && dirIP[i] <= 9) || dirIP[i] == '.')
            validateIP += 1;

          if (dirIP[i] == '.'){
            pointNum  += 1;
            currentNum = -1;
            validHexFF = 0;
            factorMult = 1; 
          }else{
            validHexFF += dirIP[i]*factorMult;
            factorMult *= 10;
          }

          //Falta quitar ceros a la Izquierda
          //console.log(validHexFF)

          if (validHexFF>255) {
            errorIPnum2 = true;
            break;
          };

          currentNum += 1;
          
          if (currentNum > 3) {
            errorIPnum = true;
            break;
          };

          if (pointNum > 3){
            errorIPnum = true;
            break;
          };
          
        };

      };

      if ((errorIPnum) || (pointNum != 3)) {
        isValidIP = false;
        document.getElementById("ValidData").innerHTML  = "Error: Dir. IP";
        document.getElementById("ValidData1").innerHTML = "Secuencia no válida!";
      };

      if (errorIPnum2) {
        isValidIP = false;
        document.getElementById("ValidData").innerHTML  = "Error: Dir. IP";
        document.getElementById("ValidData1").innerHTML = "Dirección fuera del rango permitido!";
      };


      if ((validateIP != dirIP.length) && isValidIP) {
        isValidIP = false;
        document.getElementById("ValidData").innerHTML  = "Error: Dir. IP";
        document.getElementById("ValidData1").innerHTML = "Solo son válidos números en la dirección IP!";
      };
      
      if (isValidIP) {
        console.log("IP válida! ",dirIP)
        if (namePC == "") {
          document.getElementById("ValidData").innerHTML  = "Error: Nombre";
          document.getElementById("ValidData1").innerHTML = "Es necesario un nombre para la PC!";
        
        //Validar nombre dirección física
        }else if (MACaddr.length == 17){
          for (var i = MACaddr.length - 1; i >= 0; i--) {
            //console.log('i = ',i);
            if (j == -1) { j = 2; };
            if (j ==  0) { k = 1; };
            position  = i-j;
            position2 = i+k;
            if (i <= 1 ) { position = 2; };
            //console.log(MACaddr[i]);  
            //Forma de validación: if ((Caracteres válidos<hex>) && (Posición correcta de c/u de los caracteres))
            if (((MACaddr[i] >= 0 && MACaddr[i] <= 9)   || (MACaddr[i] >= 'A'   && MACaddr[i] <= 'F') ||
               (MACaddr[i] >= 'a' && MACaddr[i] <= 'f') || (MACaddr[i] == ':')) && ((MACaddr[position] == ':') &&
                MACaddr[position2] != ':')){
               j -= 1;
               k  = 0;
               //console.log('Ok');
              if (i == 0) {

                if (validName2 && validNameSpace) {
                  console.log('Datos correctos');
                  //Do something with the correct data
                  DataForPC(namePC, dirIP, MACaddr);
                }else{
                  document.getElementById("ValidData").innerHTML  = "Error: Nombre";
                  document.getElementById("ValidData1").innerHTML = "Solo son válidos números (0-9) o letras (A-Z) para el nombre de la PC!";
                };

              };
            }else{
              //console.log('Fail');
              console.log('Error Mac Addr -> Caracter(es) no reconocido(s)');
              document.getElementById("ValidData").innerHTML  = "Error: Dir. Física";
              document.getElementById("ValidData1").innerHTML = "Caracter(es) no reconocido(s)!";
              break;
            };    
          };
        }else{
          console.log('Error Mac Addr -> Exceso o falta de números');
          document.getElementById("ValidData").innerHTML  = "Error: Dir. Física";
          document.getElementById("ValidData1").innerHTML = "Excedente o falta de caracteres!";
        };
      };
  });


//*** Petición para datos de Pc's y crear interfaz para computadoras (botones y datos)

  $.ajax({
  url: "/LoadButtonsPC"
  }).done(function(result){
    document.getElementById("NAMe").innerHTML   = "Nombre :"; 
    document.getElementById("DIRFIS").innerHTML = "Dir. F&iacutesica:"; 
    document.getElementById("DIRIP").innerHTML  = "Dir. IP:"; 
    for (var i = result.PC.length-1 ; i >= 0; i--) {     
      // Add a new button element

      $("#controlPCs").append('<option id="'+result.PC[i].pcName+'OptionPC" value="'+result.PC[i].pcName+'">'+result.PC[i].pcName+'</option>').enhanceWithin();

      $("#asd").append('<div> <a href="#" id="'+result.PC[i].pcName+'" class="ui-test ui-btn ui-shadow \
                                ui-corner-all ui-icon-power ui-btn-icon-right" data-transition="pop" \
                                style="background-color:#595959; text-align:center; color:#ffffff" \
                                data-rel="popup" data-inline="true" data-rol="button" \
                                data-position-to="window">'+result.PC[i].pcName+'</a></div>').enhanceWithin();
      //checked="checked"
      $("#ConfigureButtons").append('<div> <label for="'+result.PC[i].pcName+'2'+'" id="'+result.PC[i].pcName+'l2" style="text-align:center">\
                                    '+result.PC[i].pcName+'</label> \
                                     <input type="radio" name="pcName" class=".ui-btn"  id="'+result.PC[i].pcName+'2'+'"  \
                                     value="'+result.PC[i].pcName+'" > </div>').enhanceWithin();

      $("#macAddrTable").append(' <tbody id="'+result.PC[i].pcName+'t2" > <tr><td>'+result.PC[i].pcName+'</td> <td>'+result.PC[i].macAddr+'</td> \
                                  <td>'+result.PC[i].IP+'</td> </tr></tbody> ').enhanceWithin();

      $("#selectPC").append('<option  value="'+result.PC[i].pcName+'" id="'+result.PC[i].pcName+'ECAMural">'+result.PC[i].pcName+'</option>').enhanceWithin();

      $("#pruebaPCss").append('<div data-role="collapsible" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u"> \
                                    <div class="ui-grid-a"> \
                                      <div class="ui-block-a">\
                                        <a href="#pruebaPCsss" id="editBtnPc'+i+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-gear ui-btn-icon-left" \
                                          data-transition="flip">Editar\
                                        </a> \
                                      </div> \
                                      <div class="ui-block-b">\
                                        <a href="#pruebaPCss" id="deleteBtnPc'+i+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-delete ui-btn-icon-right" \
                                          data-transition="flip">Eliminar\
                                        </a> \
                                      </div>\
                                    </div>\
                                    <br><h1 style="text-align:center">'+result.PC[i].pcName+'</h1> \
                                    <strong>Nombre:</strong> <p style="display:inline" id=""><strong><span style="color:green">'+result.PC[i].pcName+'</span></strong></p><p></p> \
                                    <strong>Dirección Física (MAC): </strong><p id=""><span style="color:blue">'+result.PC[i].macAddr+' <span></p> \
                                    <strong>Dirección de Red (IP): </strong><p id=""><span style="color:blue">'+result.PC[i].IP+' <span></p> \
                                   </div>').enhanceWithin();

      //console.log(result.PC[i].pcName)
      pcNameArray[i]  = result.PC[i].pcName;
      macAddrArray[i] = result.PC[i].macAddr;
      ipAddrArray[i]  = result.PC[i].IP;

      
    };

    //checkPCsOn();
    console.log(ipAddrArray)
    console.log(pcNameArray)

    if (result.PC.length == 0) {
      document.getElementById("noPctoTurOn").innerHTML   = "No hay PC's para encender";
      document.getElementById("noPctoTurOn2").innerHTML  = "Para agregar PC ir a: Opción --> Agregar PC";
      document.getElementById("noDeletePC").innerHTML    = "No hay PC's para eliminar";
      document.getElementById("noTablePC").innerHTML     = "No hay PC's para mostrar";
    }else{

      // $("#ConfigureButtons").append('<br><span style="float:right"> <input id="delDataBtn" type="submit" \
      //                                 data-inline="true" value="Delete"><span>');
    }
  });  
  

//*** Petición http para valores de configuración actual de cada módulo

  $.ajax({
  url: "/getValueForModules"
  }).done(function(result){
    var auxArrayControlPc      = [];
    var auxArrayControlProject = [];
    var Names = ["Módulo:  ", "Proyector:  ", "PC:  ", "Puerto:  "];

    $("#Mural").val(result.Values[0].modulo+"_"+result.Values[0].proyector+"_"+result.Values[0].pc+"_"+result.Values[0].puerto);
    $("#ECA1").val(result.Values[1].modulo+"_"+result.Values[1].proyector+"_"+result.Values[1].pc+"_"+result.Values[1].puerto);
    $("#ECA2").val(result.Values[2].modulo+"_"+result.Values[2].proyector+"_"+result.Values[2].pc+"_"+result.Values[2].puerto);
    $("#ECA3").val(result.Values[3].modulo+"_"+result.Values[3].proyector+"_"+result.Values[3].pc+"_"+result.Values[3].puerto);
    $("#ECA4").val(result.Values[4].modulo+"_"+result.Values[4].proyector+"_"+result.Values[4].pc+"_"+result.Values[4].puerto);

    $("#mod").text("Módulo:");
    $("#pro").text("PC:");
    $("#ppcc").text("Proyector:");
    $("#prto").text("Puerto Serial:");

    for (var i = 0; i <= result.Values.length-1; i++) {

      namePcModules[i] = result.Values[i].modulo+"_"+result.Values[i].pc;
      if (result.Values[i].modulo == "Mural") {
        $("#currentConfigModulesTable").append(' <tbody id="'+result.Values[i].modulo+'t"> <tr><td>Módulo Mural</td> <td>'+result.Values[i].proyector+'</td> \
                                            <td>'+result.Values[i].pc+'</td> <td>'+result.Values[i].puerto+'</td></tr></tbody> ').enhanceWithin();
        continue; 
      };

      $("#currentConfigModulesTable").append(' <tbody id="'+result.Values[i].modulo+'t"> <tr><td>Módulo '+i+'</td> <td>'+result.Values[i].proyector+'</td> \
                                            <td>'+result.Values[i].pc+'</td> <td>'+result.Values[i].puerto+'</td></tr></tbody> ').enhanceWithin();
      //<b>'+Names[0]+'</b>
    };
    console.log(namePcModules)
  });


//*** Petición para valores/comandos de los proyectores dados de alta en el sistema

  $.ajax({
  url: "/getValueForProjectors"
  }).done(function(result){
    totalNumerProjectors = result.PROJECTORS.length;
    for (var i = 0; i <= result.PROJECTORS.length - 1; i++) {
      var aux = result.PROJECTORS[i].proyectorName.split("-");
      $("#selectProjector").append('<option value="'+result.PROJECTORS[i].proyectorName+'">'+result.PROJECTORS[i].proyectorName+'</option>').enhanceWithin();
      $("#selectProjector2").append('<option value="'+result.PROJECTORS[i].proyectorName+'2">'+result.PROJECTORS[i].proyectorName+'</option>').enhanceWithin();
      
      $("#dataForProject").append('<div data-role="collapsible" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u"> \
                                    <div class="ui-grid-a"> \
                                      <div class="ui-block-a">\
                                        <a href="#editProj" id="editBtnProj'+i+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-gear ui-btn-icon-left" \
                                          data-transition="flip">Editar\
                                        </a> \
                                      </div> \
                                      <div class="ui-block-b">\
                                        <a href="#" id="deleteBtnProj'+i+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-delete ui-btn-icon-right" \
                                          data-transition="flip">Eliminar\
                                        </a> \
                                      </div>\
                                    </div>\
                                    <br><h1 style="text-align:center">'+result.PROJECTORS[i].proyectorName+'</h1> \
                                    <strong>Marca:</strong> <p style="display:inline" id="valMarca'+i+'"><strong><span style="color:green">'+aux[0]+'</span></strong></p><p></p> \
                                    <strong>Modelo:</strong> <p style="display:inline" id="valModelo'+i+'"><strong><span style="color:green">'+aux[1]+'</span></strong></p><p></p> \
                                    <p><strong>*** Comandos en hexadecimal *** </strong></p> \
                                    <strong>Comando de encendido: </strong><p id="valonCmd'+i+'"><span style="color:blue">' +result.PROJECTORS[i].onCmd+' <span></p> \
                                    <strong>Comando de apagado: </strong><p id="valoffCmd'+i+'"><span style="color:blue">' +result.PROJECTORS[i].offCmd+' <span></p> \
                                    <strong>Comando respuesta encendido: </strong><p id="valonAckCmd'+i+'"><span style="color:blue">' +result.PROJECTORS[i].onAckCmd+' <span></p> \
                                    <strong>Comando respuesta apagado: </strong><p id="valoffAckCmd'+i+'"><span style="color:blue">' +result.PROJECTORS[i].offAckCmd+' <span></p> \
                                    <strong>BaudRate (bps): </strong><p id="valbaudRate'+i+'"><span style="color:blue">' +result.PROJECTORS[i].baudRate+'</p><span>\
                                   </div>').enhanceWithin();
    };
  });



//*** Agregregar nuevo proyector al sistema

$("#sbmtAddProjectors").click(function(e){
  var dataProjectors = $("#dataForProjectors").serialize();
  var auxdataProjectors = dataProjectors.split("&");
  var dataAuxdataProjectors;
  var validateData = false;

  console.log(auxdataProjectors);

  for (var i = auxdataProjectors.length - 1; i >= 0; i--) {
    dataAuxdataProjectors = auxdataProjectors[i].split("=")
    if (dataAuxdataProjectors[1] == "") {
      validateData = true;
      $("#ValidDataProj").text("Error");
      $("#ValidDataProj2").text("Todos los campos deben ser llenados.");
      $("#ValidDataAddProjector").popup( "open" );
    };
  };

  if (!validateData) {

    var nameProjector = auxdataProjectors[0].split("=");
    $("#ValidDataProj").text("Correcto");
    $("#ValidDataProj2").text("Los datos ingresados para proyector '"+nameProjector[1]+"' se guardaron correctamente.");
    $("#ValidDataAddProjector").popup( "open" );

    $.ajax({
       type: "GET",
       url: "/sendCmdProjector",
       data: dataProjectors 
      }).done(function(result){
        totalNumerProjectors += 1
        var lastProjector = result.PROJECTORS.length-1;
        //var obj = JSON.parse(result);
        //$("#dataForProject").text('');
        //$("#selectProjector").text('');
          var aux = result.PROJECTORS[lastProjector].proyectorName.split("-");
          $("#selectProjector").append('<option value="'+result.PROJECTORS[lastProjector].proyectorName+'">'+result.PROJECTORS[lastProjector].proyectorName+'</option>').enhanceWithin();
          $("#dataForProject").append('<div data-role="collapsible" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u"> \
                                    <div class="ui-grid-a"> \
                                      <div class="ui-block-a">\
                                        <a href="#editProj" id="editBtnProj'+lastProjector+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-gear ui-btn-icon-left" \
                                          data-transition="flip">Editar\
                                        </a> \
                                      </div> \
                                      <div class="ui-block-b">\
                                        <a href="#" id="deleteBtnProj'+lastProjector+'" class="ui-btn ui-btn-a ui-mini ui-shadow ui-icon-delete ui-btn-icon-right" \
                                          data-transition="flip">Eliminar\
                                        </a> \
                                      </div>\
                                    </div>\
                                    <br><h1 style="text-align:center">'+result.PROJECTORS[lastProjector].proyectorName+'</h1> \
                                    <strong>Marca:</strong> <p style="display:inline" id="valMarca'+lastProjector+'"><strong><span style="color:green">'+aux[0]+'</span></strong></p><p></p> \
                                    <strong>Modelo:</strong> <p style="display:inline" id="valModelo'+lastProjector+'"><strong><span style="color:green">'+aux[1]+'</span></strong></p><p></p> \
                                    <p><strong>*** Comandos en hexadecimal *** </strong></p> \
                                    <strong>Comando de encendido: </strong><p id="valonCmd'+lastProjector+'"><span style="color:blue">' +result.PROJECTORS[lastProjector].onCmd+' <span></p> \
                                    <strong>Comando de apagado: </strong><p id="valoffCmd'+lastProjector+'"><span style="color:blue">' +result.PROJECTORS[lastProjector].offCmd+' <span></p> \
                                    <strong>Comando respuesta encendido: </strong><p id="valonAckCmd'+lastProjector+'"><span style="color:blue">' +result.PROJECTORS[lastProjector].onAckCmd+' <span></p> \
                                    <strong>Comando respuesta apagado: </strong><p id="valoffAckCmd'+lastProjector+'"><span style="color:blue">' +result.PROJECTORS[lastProjector].offAckCmd+' <span></p> \
                                    <strong>BaudRate (bps): </strong><p id="valbaudRate'+lastProjector+'"><span style="color:blue">' +result.PROJECTORS[lastProjector].baudRate+'</p><span>\
                                   </div>').enhanceWithin();
      });
  };
   e.preventDefault(); 
});

//*** Eliminar PC de lista

  $("#ConfigureButtons").submit(function(e) {
    var url = "/deleteDataPC"; 
    var control = true;
    var compu = $("#ConfigureButtons").serialize();

    $.ajax({
     type: "GET",
     url: url,
     data:  compu, 
     success: function(data)
     {
      console.log(data)
        var aux = data.split("_");
        if (aux[1] == '0') {
          document.getElementById("pcDelete").innerHTML  = "Error";
          document.getElementById("pcDelete2").innerHTML = "No fue posile eliminar PC";
          $("#deletePC").popup( "open" );
        }else{
          document.getElementById("pcDelete").innerHTML  = "Correcto";
          document.getElementById("pcDelete2").innerHTML = aux[0]+" eliminada correctamente";
          $("#"+aux[0]).remove();
          $("#"+aux[0]+"l2").remove();
          $("#"+aux[0]+"t2").remove();
          $("#"+aux[0]+"2").remove();
          $("#"+aux[0]+"ECAMural").remove();
          $("#deletePC").popup( "open" );
        };
       //return confirm('clicked');
     }
   });
    e.preventDefault(); 
  });

  $("#mainPagePopup, #ValidDataAddProjector").on({
      popupbeforeposition: function () {
          $('.ui-popup-screen').off();
      }
  });
 

//*** Peticiones para el encendido de módulos, ya sea todos en conjunto o individualmente

  $("#turnOnEcaMuralb, #turnOnEcaMuralAll").on("click",function(e) {
  
    //$( "#loadIconECA4" ).html('<img src="images/loadIcon.svg"/>');
    var selectedModules;
    var y;
    var indexIP;
    var changePosForRemove;
    var changePosForRemove2;
    var auX                 = "";
    var idmodule            = "";
    var displayText         = "";
    var displayTextError    = "";
    var displayTextSuccess  = "";
    var url                 = "/sendCmdOnToUc";
    var successTurnOnModule = "";
    var failTurnOnModule    = "";

    var aux  = [];
    var aux2 = [];
    var aux3 = [];
    var idPcSendArray    = [];
    var successProjects  = [];
    var successProjects2 = [];
    var successPCs       = [];
    var successPCs2      = [];
    var responseForPcSuccessArray = [];
    var responseForPcFailArray    = [];

    var cnt            = 0;
    var cnt1           = 0;
    var cnt3           = 0;
    var cnt4           = 0;
    var cnt5           = 0;
    var cntSuccess     = 0;
    var cntSuccess2    = 0;
    var isThereAnError = 0;
    var control            = true;
    var control2           = true;
    var errorTurnOnModule  = false;
    var displayOnce        = true;

    document.getElementById("mainpageh1").innerHTML = "";
    document.getElementById("mainpageh2").innerHTML = "";
    document.getElementById("mainpageh3").innerHTML = "";
    document.getElementById("mainpageh4").innerHTML = "";
    document.getElementById("mainpageh5").innerHTML = "";
    $("#mainpageh6").html('');
    $("#mainpageh7").hide(); 

    if (event.target.id == "turnOnEcaMuralAll"){
      aux = ["Mural="+$("#Mural").val(), "ECA1="+$("#ECA1").val(), "ECA2="+$("#ECA2").val(), "ECA3="+$("#ECA3").val(), "ECA4="+$("#ECA4").val()]
    }else{
      selectedModules = $("#turnOnEcaMural").serialize();
      aux  = selectedModules.split("&");
    };

    if ((aux.length == 1) && (selectedModules.length == 0)) {
      control  = false;
      control2 = false;
      $("#mainPagePopup").popup( "open" );
      document.getElementById("mainpageh1").innerHTML = "Alerta";
      document.getElementById("mainpageh2").innerHTML = "No se ha seleccionado un módulo para encender!"
      document.getElementById("mainpageh4").innerHTML = "Haz clic o presiona el nombre del módulo para seleccionarlo."
      $("#mainpageh6").html('<a href="pageone" class="ui-btn ui-corner-all ui-shadow  \
        ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
    };

    if (control) {
      for (var j = aux.length - 1; j >= 0; j--) {
        cnt += 1;
        y    = aux[j];
        aux2 = y.split("=");
        aux3 = aux2[1].split("_"); 
        idmodule = aux2[0]+"Label";
        //$( "#loadIcon"+aux2[0]).html('<img src="images/loadIcon2.svg"/>');
        //$("#loadIcon"+aux2[0]).attr("src","images/loadIcon2.svg")
        $("#loadIconMural").attr("src","images/loadIcon2.svg")
        // document.getElementById(idmodule).style.backgroundColor = "#ffff66";
        // document.getElementById(idmodule).style.color = "#1a1a1a";
        displayText += aux2[0]+", ";
      };
    };

    if (control2) {
      cnt = displayText.length;
      $("#mainPagePopup").popup( "open" );
      document.getElementById("mainpageh1").innerHTML = "Espere...";
      document.getElementById("mainpageh2").innerHTML = "* Encendiendo: ";
      document.getElementById("mainpageh3").innerHTML = displayText.substring(-1,cnt-2);
      setTimeout(function(){ 
        $("#mainPagePopup").popup( "close" );
      }, 3000);
    };

    console.log("Encender modulos");  
    console.log("Val de modulos: ",aux);

   var prueba = aux[0].split("=")
   if (prueba[0] == "Mural") {
    setTimeout(function(){ 
        $("#MuralLabel").css("backgroundColor","#4dff4d");
        $("#MuralLabel").css("color","#1a1a1a");
        $("#MuralLabel").text("Mural - on");
        $("#loadIconMural").attr("src","");
      }, 10000);
   };

    for (var i = aux.length - 1; i >= 0; i--) {
      
      $.ajax({
       type: "GET",
       url: url,
       data: aux[i] 
      }).done(function(data){
          cntSuccess += 1;

          //Formato de respuesta = [Modulo, Proyector, PC, Puerto,respuestaMicro, envíoPaquetesUDP]
          // respuestaMicro   = 1 (success) ---  respuestaMicro   = 2 & 3 (error)
          // envíoPaquetesUDP = 1 (success) ---  envíoPaquetesUDP = 0     (error)

          if (displayOnce) {
            console.log("Formato de respuesta = [Modulo, Proyector, PC, Puerto, respuestaMicro, envíoPaquetesUDP]")
            displayOnce = false;
          };
          var auxResponse = data.split("_");
          console.log(auxResponse[0]+" ResponseProyPC: ",auxResponse);     

          if ((auxResponse[4] != '1') || (auxResponse[5] != '1')) {
            //$("#loadIcon"+auxResponse[0]).attr("src","images/blankReload.png");
            getStatusModuleOn = false;
           // $("#mainPagePopup").popup( "open" );
           // document.getElementById("mainpageh1").innerHTML = "Error";
           // document.getElementById("mainpageh2").innerHTML = "Fallo de conexión.";
           // document.getElementById("mainpageh3").innerHTML = "";
           // document.getElementById("mainpageh4").innerHTML = "No se pudieron encender los módulos seleccionados.";
           // $("#mainpageh6").html('<a href="pageone" class="ui-btn ui-corner-all ui-shadow  \
           //  ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
          }else{
            getStatusModuleOn = true; 
          }S  
        
        }).then(function( data ) { 
          
          $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
        

        });
      e.preventDefault(); 
    };
  });


//*** Peticiones para el apagado de módulos, ya sea todos en conjunto o individualmente

 $("#turnOffEcaMural, #turnOffEcaMuralAll").on("click", function(e) {

    var selectedModules;
    var y;
    var indexIP;
    var changePosForRemove;
    var changePosForRemove2;
    var auX                 = "";
    var idmodule            = "";
    var displayText         = "";
    var displayTextError    = "";
    var displayTextSuccess  = "";
    var url                 = "/sendCmdOffToUc";
    var successTurnOnModule = "";
    var failTurnOnModule    = "";

    var aux  = [];
    var aux2 = [];
    var aux3 = [];
    var idPcSendArray    = [];
    var successProjects  = [];
    var successProjects2 = [];
    var successPCs       = [];
    var successPCs2      = [];
    var responseForPcSuccessArray = [];
    var responseForPcFailArray    = [];

    var cnt            = 0;
    var cnt1           = 0;
    var cnt3           = 0;
    var cnt4           = 0;
    var cnt5           = 0;
    var cntSuccess     = 0;
    var cntSuccess2    = 0;
    var isThereAnError = 0;
    var control             = true;
    var control2            = true;
    var errorTurnOnModule   = false;
    displayOnce = true;

    document.getElementById("mainpageh1").innerHTML = "";
    document.getElementById("mainpageh2").innerHTML = "";
    document.getElementById("mainpageh3").innerHTML = "";
    document.getElementById("mainpageh4").innerHTML = "";
    document.getElementById("mainpageh5").innerHTML = "";
    $("#mainpageh6").html('');
    $("#mainpageh7").hide(); 

    if (event.target.id == "turnOffEcaMuralAll"){
      aux = ["Mural="+$("#Mural").val(), "ECA1="+$("#ECA1").val(), "ECA2="+$("#ECA2").val(), "ECA3="+$("#ECA3").val(), "ECA4="+$("#ECA4").val()]
    }else{
      selectedModules = $("#turnOnEcaMural").serialize();
      aux  = selectedModules.split("&");
    };

    if ((aux.length == 1) && (selectedModules.length == 0)) {
      control  = false;
      control2 = false;
      $("#mainPagePopup").popup( "open" );
      document.getElementById("mainpageh1").innerHTML = "Alerta";
      document.getElementById("mainpageh2").innerHTML = "No se ha seleccionado un módulo para apagar!"
      document.getElementById("mainpageh4").innerHTML = "Haz clic o presiona el nombre del módulo para seleccionarlo."
      $("#mainpageh6").html('<a href="pageone" class="ui-btn ui-corner-all ui-shadow  \
        ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
    };

    if (control) {
      console.log(control)
      for (var j = aux.length - 1; j >= 0; j--) {
        y    = aux[j];
        aux2 = y.split("=");
        aux3 = aux2[1].split("_"); 
        idmodule = aux2[0]+"Label";
        //$("#loadIcon"+aux2[0]).attr("src","images/loadIcon2.svg");
        $("#loadIconMural").attr("src","images/loadIcon2.svg");
        displayText += aux2[0]+", ";
        cnt += 1;
      }
    };

    if (control2) {
      cnt = displayText.length;
      $("#mainPagePopup").popup( "open" );
      document.getElementById("mainpageh1").innerHTML = "Espere...";
      document.getElementById("mainpageh2").innerHTML = "* Apagando: ";
      document.getElementById("mainpageh3").innerHTML = displayText.substring(-1,cnt-2);
      setTimeout(function(){ 
        $("#mainPagePopup").popup( "close" );
      }, 3000);
    };


    console.log("Apagar modulos");
    console.log("Val de modulos: ",aux);

    var prueba = aux[0].split("=");
   if (prueba[0] == "Mural") {
    setTimeout(function(){ 
        $("#MuralLabel").css("backgroundColor","#595959");
        $("#MuralLabel").css("color","#ffffff");
        $("#MuralLabel").text("Mural - off");
        $("#loadIconMural").attr("src","");
        $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
      }, 5000);
   };

    for (var i = aux.length - 1; i >= 0; i--) {
      
      $.ajax({
       type: "GET",
       url: url,
       data: aux[i] 
      }).done(function(data){
        cntSuccess += 1;

        //Formato de respuesta = [Modulo, Proyector, PC, Puerto,respuestaMicro, envíoPaquetesUDP]
        if (displayOnce) {
          console.log("Formato de respuesta = [Modulo, Proyector, PC, Puerto, respuestaMicro, envíoPaquetesUDP]")
          displayOnce = false;
        };
        var auxResponse = data.split("_");
        console.log(auxResponse[0]+" ResponseProyPC: ",auxResponse);   
        
        if (auxResponse[4] != '1') {
          //$("#loadIcon"+auxResponse[0]).attr("src","images/blankReload.png");
          //getStatusModuleOff = false;
          //$("#mainPagePopup").popup( "open" );
          //document.getElementById("mainpageh1").innerHTML = "Error";
          //document.getElementById("mainpageh2").innerHTML = "Fallo de conexión.";
          //document.getElementById("mainpageh3").innerHTML = "";
          //document.getElementById("mainpageh4").innerHTML = "No se pudieron apagar los módulos seleccionados.";
          //$("#mainpageh6").html('<a href="pageone" class="ui-btn ui-corner-all ui-shadow  \
          //|   ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
        }else{
          //getStatusModuleOff = true; 
        }       

        }).then(function( data ) { 
          $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");

        });
      e.preventDefault(); 
    };
  });

  $("#programPagePopup").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
  });


  //*** Establecer programación de módulos en fecha y hora especificada por el usuario

  $("#programECAMuralSubmit").click(function(e) {

    console.log("Programar ECA/Mural");
    var data    = $("#programECAMural").serialize(); 
    var auxData = data.split("&");
    var validData = true;
    var url = "/programMuralEca"; 
    
    var modulo = auxData[0].split("=");
    var date   = auxData[1].split("=");
    var time   = auxData[2].split("=");

    var time1  = time[1].split("%3A");
    var dataDate = date[1].split("-");

    var rangoTiempo = 1000*1;

    var x = new Date();
    x.setFullYear(dataDate[0],dataDate[1]-1,dataDate[2]);
    x.setHours(time1[0]);
    x.setMinutes(time1[1]);

    $("#programPageh4").hide();
    $("#programPageh5").hide();

    if ((x.getTime())<(datE.getTime()+rangoTiempo)) {
      url = "/fail"
      $("#programPagePopup").popup( "open" );
      document.getElementById("programPageh1").innerHTML = "Error";
      document.getElementById("programPageh2").innerHTML = "El horario o la fecha seleccionada no es válida!"
      $("#programPageh3").html('<a href="#Scheduling" class="ui-btn ui-corner-all ui-shadow  ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
    }

    $.ajax({
     type: "GET",
     url: url,
     data: data 
    }).done(function(result){
      if (result == "ok") {
        $("#programPagePopup").popup( "open" );
        document.getElementById("programPageh1").innerHTML = "Correcto";
        document.getElementById("programPageh2").innerHTML = "Se ha programado el módulo '"+modulo[1]+"' para el "+ dataDate[2]+" de "+days[Number(dataDate[1])-1]+" a las "+time1[0]+":"+time1[1]+" horas."
        $("#programPageh3").html('<a href="#Scheduling" class="ui-btn ui-corner-all ui-shadow  ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
      }else{
        $("#programPagePopup").popup( "open" );
        document.getElementById("programPageh1").innerHTML = "Error";
        document.getElementById("programPageh2").innerHTML = "No ha sido posible programar el módulo '"+modulo[1]+"'."
        $("#programPageh3").html('<a href="#Scheduling" class="ui-btn ui-corner-all ui-shadow  ui-btn-b" data-rel="back" data-transition="pop" data-position-to="window">Ok</a>');
      }
    });      
    e.preventDefault(); 
  });
  

  $("#cancelTurnOff").click(function(){
    $.ajax({
     type: "GET",
     url: "/cancelMuralEca"
    }).done(function(result){
      if (result == "ok") {
      }
     });
  });

//*** Checar programación de módulos en fecha y hora especificada por el usuario
  
  $("#alertProgramECAMural").click(function(){

    //$('#programPagePopup').css('data-position-to',window);

    var data     = $("#programECAMural").serialize(); 
    var auxData  = data.split("&");
    var validData = true;
    console.log(auxData)
    

  });
  

  $.ajax({
     type: "GET",
     url: "/programMuralEcaConfirm"
    }).done(function(result){
      var moduleOn = "";
      var aux = result.split("-")
      aux.pop();
      
      if (aux.length != ""){
        var x;

        for (var i = aux.length - 1; i >= 0; i--) {
          x = aux[i].split("_")
          moduleOn += x[0]+" ";
        };

        console.log(moduleOn);

        $("#mainPagePopup").popup("open");
        document.getElementById("mainpageh1").innerHTML = "Alerta";
        document.getElementById("mainpageh2").innerHTML = "Se encendió módulo(s):";
        document.getElementById("mainpageh3").innerHTML = moduleOn;
        document.getElementById("mainpageh4").innerHTML = "Se apagarán en 5 min. Haz click en Aceptar para cancelar el apagado!";
        

      }else{
      // $("#mainPagePopup").popup("close");
      };
    });

    // $(function () {
    //       $(window).bind("load",
    //         function (e) {
    //           $("#mainPagePopup").popup("open");
    //           document.getElementById("mainpageh1").innerHTML = "Alerta";
    //           document.getElementById("mainpageh2").innerHTML = "Se encendió módulo(s):";
 
    //           document.getElementById("mainpageh4").innerHTML = "Se hará el apagado en 5 min. Haz click en Aceptar para cancelar el apagado!";
    //         });
    //     }); 


  $("#configEca_Mural").submit(function(e) {
    console.log("Config ECA/Mural");

    var url = "/"; 
    $.ajax({
           type: "GET",
           url: url,
           data: $("#configEca_Mural").serialize(), 
           success: function(data)
           {

           }
         });
    e.preventDefault(); 
  });

  // $("#datepicker").datepicker();

//*** Opción de recargar página principal

  $("#refreshMainPage").click(function(){
    location.reload(true);
  });


//*** Petición para archivos disposnibles/subidos en el servidor

     $.ajax({
    url: "/readContentFile"
    }).done(function(result){
      var thereAreFiles = false;
      var filesData = result.split(":");
      for (var i = filesData.length - 1; i >= 0; i--) {
        if ((filesData[i] == ".DS_Store") || (filesData[i] == "desktop.ini") || (filesData[i] == "")) {
          continue
        };
        thereAreFiles = true;
        filesArray[i]     = "files"+i;
        filesArrayName[i] = filesData[i];
       
          
        $("#displayFiles").append('<label for="files'+i+'" style="text-align:center;">'+filesData[i]+'</label>\
                                   <input type="radio" name="files" id="files'+i+'" value="" data-iconpos="left" data-shadow="true">')
        //$("#displayFiles").append('<div><a id=files'+i+' class="ui-btn">'+filesData[i]+' </a></div>').enhanceWithin();
        $("#displayDownloads").append('<a href="/downloadFiles?file='+filesData[i]+'" target="_self" class="ui-btn ui-corner-all ui-shadow ">'+filesData[i]+'</a>').enhanceWithin();
        
      };
      if (!thereAreFiles) {
        document.getElementById("textDisplayFiles").innerHTML  = "No hay Archivos para proyectar!";
        document.getElementById("textDisplayFiles2").innerHTML = "Para subir un archivo al servidor ir a --> 'Subir' en las opciones de la parte superior.";
        document.getElementById("textDisplayFilesDL").innerHTML  = "No hay Archivos para descargar!";
        document.getElementById("textDisplayFilesDL2").innerHTML = "Para subir un archivo al servidor ir a --> 'Subir' en las opciones de la parte superior en la sección de Archivos.";
      };
    });

}); //Close: $(document).ready(function(){

 



// ******************************************************************************
// ********************************* Funciones ********************************** 
// ******************************************************************************


function PC_ON(pcName, pcIP, pcTarget){
  console.log("Nombre: ",pcName);
  console.log("MacA:   ",pcTarget);
  console.log("IP:     ",pcIP);
    $.ajax({
    url: "/TurnOnPC",
    data: {namePC:pcName,target: pcTarget}
  }).done(function(result){
    var response = result.split("_");
    //console.log(result)
    if (response[1] == '0') {
      //$("#DELL1Dialogue").popup( "open" );
      //document.getElementById("PcOn_PSend").innerHTML   = "Error";
      //document.getElementById("PcOn_PSend2").innerHTML  = "Computadora "+response[0]+" NO encendida!";
    }else if(response[1] == '2'){
      //$("#DELL1Dialogue").popup( "open" );
      //document.getElementById("PcOn_PSend").innerHTML   = "Error";
      //document.getElementById("PcOn_PSend2").innerHTML  = "No se encntró la pc "+response[0]+" en la lista !";
    }else{
      //$("#DELL1Dialogue").popup( "open" );
      //document.getElementById("PcOn_PSend").innerHTML  = "Espere...";
      //document.getElementById("PcOn_PSend2").innerHTML  = "Encendiendo "+response[0];
      //setTimeout(function(){$("#DELL1Dialogue").popup( "close" );}, 5000);

      // No hay una forma de verificar que la computadora se encendió, ya que no se recibe respuesta 
      // por parte de esta (Ack)... pero si los paquetes UDP fueron correctamente enviados por la red local
      // y la conexion entre la computadora y el access point están correctas y que además la computadora
      // cuente con las configuraciones adecuadas para el encendido a través de la red, entonces damos por
      // hecho que el encendido fue correcto y cambiamos el estado del botón de negro (off) a verde (on)
      // document.getElementById("PcOn_PSend").innerHTML   = "Success";
      // document.getElementById("PcOn_PSend2").innerHTML  = "Computadora "+result+" encendida!";
      // document.getElementById(pcName).style.backgroundColor = " #00cc00";
      // document.getElementById(pcName).style.color = "#1a1a1a";
      // $.ajax({
      //    type: "GET",
      //    url: "/checkPcOn",
      //    data: {IP: pcIP, pcName: pcName},
      //    success: function(data)
      //    {
      //     console.log("Response: ",data);
      //     $("#DELL1Dialogue").popup( "open" );
      //     if (data == '1') {
      //       document.getElementById("PcOn_PSend").innerHTML   = "Success";
      //       document.getElementById("PcOn_PSend2").innerHTML  = "Computadora "+response[0]+" encendida!";
      //       document.getElementById(pcName).style.backgroundColor = " #00cc00";
      //       document.getElementById(pcName).style.color = "#1a1a1a";
      //     }else{
      //       document.getElementById("PcOn_PSend").innerHTML   = "Error";
      //       document.getElementById("PcOn_PSend2").innerHTML  = "Computadora "+response[0]+" NO encendida!";
      //     };
      //     setTimeout(function(){$("#DELL1Dialogue").popup( "close" );}, 5000); 
      //    }
      // });
    };
  });
};


//*** Funcón que realiza una petición para envío de datos al servidor, para PC dadas de alta en el sistema

function DataForPC(namePC, dirIP, MacAddress){
    var aux = true;

    $.ajax({
    url: "/writeDataPC",
    data: {name: namePC, IP: dirIP, MacA: MacAddress}
    }).done(function(result){
    if (result == "ok") {
      $("#asd").append('<div><a id="'+namePC+'" href="#"  \
                        class="ui-test ui-btn ui-shadow \
                        ui-corner-all ui-icon-power ui-btn-icon-right" data-transition="pop" \
                        style="background-color:#595959; text-align:center; color:#ffffff" \
                        data-rel="popup" data-inline="true" data-rol="button" \
                        data-position-to="window">'+namePC+'</a></div>').enhanceWithin();
                          
      $("#ConfigureButtons").append('<div> <label for="'+namePC+'2'+'" id="'+namePC+'l2'+'" style="text-align:center">\
                                    '+namePC+'</label> <input type="radio"  name="pcName" \
                                     class=".ui-btn" id="'+namePC+'2'+'" value="'+namePC+'" > </div>').enhanceWithin();

      $("#macAddrTable").append(' <tbody id="'+namePC+'t2'+'" > <tr><td>'+namePC+'</td> <td>'+MacAddress+'</td> \
                                  <td>'+dirIP+'</td></tr></tbody> ').enhanceWithin();

      $("#selectPC").append('<option value="'+namePC+'" id="'+namePC+'ECAMural'+'">'+namePC+'</option>').enhanceWithin();

      for (var i = pcNameArray.length - 1; i >= 0; i--) {
        if ((pcNameArray[i] == namePC) || (macAddrArray[i] == MacAddress) || (macAddrArray[i] == dirIP)) { 
          aux = false;
          break; 
        };
      };

      if (aux) {
        pcNameArray.push(namePC);
        macAddrArray.push(MacAddress);
        ipAddrArray.push(dirIP);


        document.getElementById("ValidData").innerHTML     = "Success";
        document.getElementById("ValidData1").innerHTML    = "PC " + '"' + namePC + '"' + ' ' + "guardada correctamente!";
        document.getElementById("noPctoTurOn").innerHTML   = " ";
        document.getElementById("noPctoTurOn2").innerHTML  = " ";
        document.getElementById("noDeletePC").innerHTML    = " ";
        document.getElementById("noTablePC").innerHTML     = " ";

        controlChDial = true;
        
      }else{
        document.getElementById("ValidData").innerHTML  = "Error";
        document.getElementById("ValidData1").innerHTML = "Nombre, IP o Mac Address ya existen en la lista!";
     } 

    }else{
      document.getElementById("ValidData").innerHTML  = "Error";
      document.getElementById("ValidData1").innerHTML = "Nombre, IP o Mac Address ya existen en la lista!";
    } 
    //location.reload();
  });
}


//*** Función para actualizar la hora cada 1000 ms

function updateClock() {
  days = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  datE  = new Date();
  dia   = datE.getDate();
  mes   = days[datE.getMonth()];
  año   = datE.getFullYear();
  fecha = dia+" de "+mes+" del "+año;

  datE.getSeconds();
  datE.getMinutes();
  datE.getHours()-1;

  document.getElementById("currentDate").innerHTML = fecha;
  setTimeout(updateClock, 1000);
}


// *** Función que realiza peticiones a las PC dadas de altas en el sistema para saber si están encendidas

function checkPCsOn(){

  // var auxpcName     = []; 
  // var getModulesOn  = [];
  // var pruebaPc  = $("#controlPCs").serialize();
  // auxpcName     = pruebaPc.split('=');
  
  // var i = ipAddrArray.length;

  // for (var i = ipAddrArray.length - 1; i >= 0; i--) {
  //   //console.log(pcNameArray[cntIP])
  //   $.ajax({
  //    type: "GET",
  //    url: "/checkPcOn2",
  //    data: {IP: ipAddrArray[i], pcName:pcNameArray[i]}
  //   }).done(function(data){
  //     var pc = data.split("_");
  //     console.log(pc)
    
  //   })
  //   if (i == 0 ) {
  //     setTimeout(checkPCsOn, 10000);
  //   };
  // };
  var auxpcName     = []; 
  var getModulesOn  = [];
  var pruebaPc  = $("#controlPCs").serialize();
  auxpcName     = pruebaPc.split('=');
  

  var i = ipAddrArray.length;

  
 // for (var i = ipAddrArray.length - 1; i >= 0; i--) {
  if (controlEnterFunction) {
    //console.log(pcNameArray[cntIP])
    $.ajax({
     type: "GET",
     url: "/checkPcOn2",
     data: {IP: ipAddrArray[cntIP], pcName:pcNameArray[cntIP]}
    }).done(function(data){
      var pc = data.split("_");
      console.log(pc)
      
console.log(namePcModules)
        if (pc[1] == "on") {
          pcOnArray[pcOnCnt] = pc[0];
          pcOnCnt += 1;
          
          //document.getElementById(pc[0]).style.backgroundColor = " #00cc00"; //Encendido - verde
          //document.getElementById(pc[0]).style.color = "#1a1a1a";
          
          for (var j = namePcModules.length-1; j>=0; j--) {
            getModulesOn = namePcModules[j].split("_");

            if (getStatusModuleOn) {
              $("#loadIcon"+getModulesOn[0]).attr("src","images/blankReload.png");
              getStatusModuleOn = false;
            };

            if(pc[0] == getModulesOn[1]){
              document.getElementById(getModulesOn[0]+"Label").style.backgroundColor = "#4dff4d";
              document.getElementById(getModulesOn[0]+"Label").style.color = "#1a1a1a";
              document.getElementById(getModulesOn[0]+"Label").innerHTML = getModulesOn[0]+" - on";
              break;
            }
          };

        }else{
          pcOffArray[pcOffCnt] = pc[0];
          pcOffCnt += 1;

          //document.getElementById(pc[0]).style.backgroundColor = " #595959"; //Apagado - Negro
          //document.getElementById(pc[0]).style.color = "#ffffff";
          for (var j = namePcModules.length-1; j>=0; j--) {
            getModulesOn = namePcModules[j].split("_");

            if (getStatusModuleOff) {
              $("#loadIcon"+getModulesOn[0]).attr("src","images/blankReload.png");
              getStatusModuleOff = false;
            };

            if(pc[0] == getModulesOn[1]){
              document.getElementById(getModulesOn[0]+"Label").style.backgroundColor = "#595959";
              document.getElementById(getModulesOn[0]+"Label").style.color = "#ffffff";
              document.getElementById(getModulesOn[0]+"Label").innerHTML = getModulesOn[0]+" - off";
              break;
            }
          };
        }
         
        cntIP += 1;
        if (cntIP == i) {
          console.log("PC's On  = ",pcOnArray)
          console.log("PC's Off = ",pcOffArray)
          pcOnArray2  = pcOnArray;
          pcOffArray2 = pcOffArray;
          cntIP = 0;
          controlEnterFunction = false;
        }
        checkPCsOn();

      });
    }else{
      setTimeout(function(){ 
        controlEnterFunction = true;
        auxNamePCdata = false;
        pcOnArray  = [];
        pcOffArray = [];
        pcOnCnt  = 0
        pcOffCnt = 0
        checkPCsOn();
      },1000*10); 
    }
};


// *** Función que realiza una petición al módulo seleccionado para ejecutar un archivo en este

function startfile(file){

  var auxfilesName = "";
  for (var i = 0; i < file.length; i++) {
    if(file[i] == ' '){
      auxfilesName += "*";
    }else{
      auxfilesName += file[i];
    }

  }; 
 
  moduleFile = $('#whichModuleShowFile').serialize();
  auxmoduleFile = moduleFile.split('=')

  $.ajax({

  data: {fileName: auxfilesName, modulo: auxmoduleFile[1]},
  url: "/startFile"
  }).done(function(result){
    console.log(result)
  });

}


function changeDataPC(){
    var pruebaPc = $("#controlPCs").serialize();
    //console.log("Pc's On = ",pcOnArray)
    //console.log(pruebaPc)
    var auxpcName = pruebaPc.split('=');
    var auxControlPCs = false;

    for (var i = pcNameArray.length - 1; i >= 0; i--) {
      if ((pcNameArray[i] == auxpcName[1])) { 
        $("#displayIPMAC").html('<strong><p class="aligCenter">Dir. Fis: </strong>'+macAddrArray[i]+'</p> \
                                 <strong><p class="aligCenter">Dir.  IP: </strong>'+ipAddrArray[i]+'</p>');
        break;
      };
    };

    //stroke-width="0"
    //stroke="black"
    for (var i = pcOnArray2.length - 1; i >= 0; i--) {
      if ((pcOnArray2[i] == auxpcName[1]) ) { 
        $("#powerPCButton").html('<svg height="35px" width="35px">\
                                    <circle  cx="20" cy="18" r="10"  fill="#5cd65c" />\
                                  </svg>');
        auxControlPCs = true;
        break;
      }
    };
    if (!auxControlPCs) {
        $("#powerPCButton").html('<svg height="35px" width="35px">\
                                    <circle  cx="20" cy="18" r="10"  fill="black" />\
                                  </svg>');
    };
  

  setTimeout(changeDataPC, 100);
}  

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function detectmob() {

   if(window.innerWidth <= 800 && window.innerHeight <= 600) {
    $("#brScreenTop").html("");
    $("#brScreenMiddle").html("");
    $("#brScreenMiddle2").html("");
    $("#brScreenBottom").html("");
    
     //return true;
   } else {
    $("#brScreenTop").html("<br><br>");
    $("#brScreenMiddle").html("<br>");
    $("#brScreenMiddle2").html("<br>");
    $("#brScreenBottom").html("<br><br>");
    
    
     //return false;
   }
   setTimeout(detectmob, 100);
}


// $("#asd").append('<div><a id="turnOnBtn" href="#DELL1Dialogue"  \
//                     class="ui-btn ui-shadow ui-corner-all ui-btn-b" data-transition="pop" \
//                     data-rel="popup" data-inline="true" data-rol="button" \
//                     data-position-to="window">'+namePC+'</a></div>');


//Agregar botón dinámico
//     $(document).on('click', '#button', function(){        
//         //var buttonNo = $('[data-role="button"]').length        
//         // Add a new button element
//         $('[data-role="content"]').append('<a data-role="button" data-theme="b" data-icon="plus" data-iconpos="right">Save</a>');
//         // Enhance new button element
//         $('[data-role="button"]').button();        
//     });   
// });

//Control de boton ok de cuadro de dialogo en Pag. "Add Computer"
// if (ADDPC = event.target.id) {
//   if (controlChDial) {
//     document.getElementById("addSuccess").setAttribute("href","#ComputersControl");
//   }else{
//     document.getElementById("addSuccess").setAttribute("href","#AddComputers");   
//   };
//   return;
// };