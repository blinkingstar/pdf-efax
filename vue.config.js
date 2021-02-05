module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    "builderOptions":{
      "appId": "net.blinkingstar.pdf-efax",
      "productName": "PDF eFax",
      "win":{
        "target": "portable",
        "arch": [
          "x64"
        ]
      }
    },
  }
}