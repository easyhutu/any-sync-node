const route = require('express')
const service = require('./servive')

const router = route.Router()

router.get('/x/ping', service.ping.pingDev)
router.get('/x/localInfo', service.ping.localInfo)
router.get('/x/setting', service.anySetting.getSetting)
router.post('/x/setting', service.anySetting.setSetting)
router.post('/x/translate', service.anySetting.transInfo)
router.post('/x/upload', service.upload.uploadHandler.single('file'), service.upload.uploadFunc)

router.get('/openapi/batchDevices', service.openApi.batchDevices)
router.post('/openapi/openUrl', service.openApi.openUrl)

router.get('/', function (req, res) {
    let token = req.query.token
    if(token){
        res.cookie('OAUTH', token)
    }

    res.redirect(`/index.html`)
})

module.exports = {
    router
}