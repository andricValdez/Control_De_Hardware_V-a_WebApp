var express = require('express');
var router = express.Router();
var handlers = require("handlers/index.js")
   
/* GET home page. */
router.get('/', handlers.welcome);

//Cuando encuentres la URL/ruta /ON1 manda a llamar a ON1 en handlers
router.get('/sendCmdOnToUc', handlers.sendCmdOnToUc);

router.get('/taskKill', handlers.taskKill);

router.get('/deleteFile', handlers.taskKill);

router.get('/downloadFiles', handlers.downloadFiles);

router.get('/sendCmdOffToUc', handlers.sendCmdOffToUc);

router.get('/TurnOnPC', handlers.TurnOnPC);

router.get('/TurnOffPC', handlers.TurnOffPC);

router.get('/startFile', handlers.startFile);

router.get('/prueba2', handlers.prueba2);

router.get('/shutdownMyself', handlers.shutdownMyself);

router.get('/puerto4', handlers.puerto4);

router.get('/sendCmdProjector', handlers.sendCmdProjector);

router.get('/checkPcOn', handlers.checkPcOn);

router.get('/checkPcOff', handlers.checkPcOff);

router.get('/checkPcOn2', handlers.checkPcOn2);

router.get('/writeDataPC', handlers.writeDataPC);

router.get('/LoadButtonsPC', handlers.LoadButtonsPC);

router.get('/deleteDataPC', handlers.deleteDataPC);

router.get('/programMuralEca', handlers.programMuralEca);

router.get('/readContentFile', handlers.readContentFile);

router.get('/whatIsYourIP', handlers.whatIsYourIP);

router.get('/programMuralEcaConfirm', handlers.programMuralEcaConfirm);

router.get('/cancelMuralEca', handlers.cancelMuralEca);

router.get('/configureMuralEca', handlers.configureMuralEca);

router.get('/getValueForModules', handlers.getValueForModules);

router.get('/getValueForProjectors', handlers.getValueForProjectors);

module.exports = router;
