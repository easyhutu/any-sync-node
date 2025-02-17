const {Devs} = require('./../model')
const {getDeviceInfo, getLocalDeviceIp} = require('./../utils')
const {MasterId} = require('./../config')


function pingDev(req, res) {
    let devInfo = getDeviceInfo(req)
    if (devInfo.setCookie) {
        res.cookie(devInfo.name, devInfo.deviceId)
    }
    let isMaster = req.query.masterId === MasterId
    console.log('devs:', JSON.stringify(Devs))
    let devices = Devs.checkDev(devInfo.deviceId, devInfo.show, devInfo.cate, null, isMaster)
    devices.serInfo = {
        ip: getLocalDeviceIp(),
        shareUrl: `http://${getLocalDeviceIp()}:${global.SrvListenPort}/?token=${req.cookies.OAUTH}`
    }
    res.send(devices)

}

function localInfo(req, res) {
    let Info = {
        ip: getLocalDeviceIp(),
        shareUrl: `http://${getLocalDeviceIp()}:${global.SrvListenPort}`
    }
    res.send(Info)
}

module.exports = {
    pingDev,
    localInfo
}

