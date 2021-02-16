module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "net.blinkingstar.pdf-efax",
        productName: "PDF eFax",
        win:{
          target: [
            "zip",
            {
              "target": "nsis",
              "arch": [
                "x64"
              ]
            }
          ]
        },
        extraResources: [
          "scansnap.ini"
        ],
      },
    },
    
  }
}