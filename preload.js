const path = require('path')
const fs = require('fs')
const { shell } = require('electron')
const cp = require('child_process')
let mlocateCache = []

window.exports = {
  "linux-mlocate": { // 注意：键对应的是 plugin.json 中的 features.code
    mode: "list",  // 列表模式
      args: {
        enter: (action, callbackSetList) => {
          mlocatePath = []
          cp.exec("which locate", (error, stdout, stderr) => {
            if (error) return callbackSetList([{title: '尚未安装mlocate,请手动安装。'}]) 
            if (!stdout.trim()) return
            const list = stdout.trim().split('\n')
            list.forEach(r => {
              const rl = r.split('\n')
              mlocatePath.push({ title: "已找到mlocate，首次使用请手动执行：sudo updatedb", description: rl[0] })
            })
            callbackSetList(mlocatePath)
          })
        },
        search: (action, searchWord, callbackSetList) => {
          if (!searchWord) return callbackSetList()
          mlocateCache = []
          searchWord = searchWord.toLowerCase()
          cp.exec("/bin/locate -i " + searchWord, (error, stdout, stderr) => {
            // if (error) return window.utools.showNotification(stderr)
            if (!stdout.trim()) return
            const list = stdout.trim().split('\n')
            list.forEach(r => {
              const rl = r.split('\n')
              const fileName = r.split('/')
              mlocateCache.push({ title: rl[0], description: fileName.slice(-1) })
            })
            callbackSetList(mlocateCache)
          })
        },

        // 用户选择列表中某个条目时被调用
        select: (action, itemData, callbackSetList) => {
           window.utools.hideMainWindow()
           const path = itemData.title
           window.utools.shellShowItemInFolder(path)
           window.utools.outPlugin()
        },
        // 子输入框为空时的占位符，默认为字符串"搜索"
        placeholder: "Linux文件搜索"
    } 
  }
}
