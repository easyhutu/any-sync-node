const express = require('express')
const cookieParser = require('cookie-parser')
const expressWs = require('express-ws')
const urlencode = require('urlencode')
const {router} = require('./router')
const {syncWSMng} = require('./servive')
const {basename} = require('path')
const {resourcesPath, distPath, MasterId, ipcRemoteFunc} = require('./config')
const {getLocalDeviceIp, totp} = require('./utils')
const appSrv = express()


function handleExpress(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
    let oToken = req.cookies.OAUTH

    if (oToken) {
        let validateResult = totp.validate({token: oToken})
        console.log(req.originalUrl, validateResult, oToken)
        switch (validateResult) {
            case 0:
                next()
                break
            case -1:
                res.cookie('OAUTH', totp.generate())
                next()
                break
            default:
                res.send({code: -1, msg: '认证失败'})
                break
        }
    } else {
        res.send({code: -1, msg: '认证失败'})
    }
}

expressWs(appSrv)

appSrv.use(express.json())
appSrv.use(express.urlencoded({extended: true}))

appSrv.use(cookieParser())
appSrv.use('/x/*', handleExpress)
appSrv.use(router)


appSrv.use('/x/dl', express.static(resourcesPath, {
    setHeaders: (res, p) => {
        let realName = basename(p).substring(33)
        res.set('Content-disposition', `attachment;filename=${urlencode(realName)}`)
    }
}))
appSrv.use('/verify/token', (req, res) => {
    let token = req.body.token
    console.log(token, totp.validate({token: token}))
    if (totp.validate({token: token}) === 0) {
        res.setHeader('OAUTH', totp.generate())
        res.send({'code': 0})
    } else {
        res.send({msg: '验证失败', code: -1})
    }

})

appSrv.use(express.static(distPath))

var syncWsM = syncWSMng.newSyncWsManager(appSrv)
syncWsM.listenClientConnect()

global.SYNCWS = syncWsM

module.exports = {
    appSrv, MasterId, syncWsM, ipcRemoteFunc
}

appSrv.listen(global.SrvListenPort, () => {
    console.log(`express run:${getLocalDeviceIp()}:${global.SrvListenPort}`)
    console.log('url:', totp.toString())
})