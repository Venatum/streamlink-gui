import {StreamLinkGuiMutations} from '@/store/mutations'

const childProcess = require('child_process')
const electron = require('electron')
const path = require('path')
const fs = require('fs')

/**
 * startStream
 */
export function startStream (command, ctx) {
  let cmd = childProcess.spawn(command, {
    shell: true
  })

  cmd.stdout.on('data', (data) => {
    data = data.toString('utf8')
    if (data.includes('error')) {
      let output = data.slice(data.indexOf('error:') + 6)
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: output, type: 'error' })
    } else if (data.includes('info')) {
      let output = data.slice(data.indexOf('[info]') + 6)
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: output, type: 'info' })
    } else {
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: data, type: 'info' })
    }
  })
  cmd.stderr.on('data', (data) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: data, type: 'error' })
  })
  cmd.on('error', (err) => {
    console.error('Failed to start child process.', err)
  })
  // cmd.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
}

/**
 * onLive
 */

function execCmdLive (command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

export async function onLive (command) {
  try {
    let stdout = await execCmdLive(command)

    if (stdout) {
      if (stdout.includes('Available streams')) {
        return true
      } else if (stdout.includes('No playable streams found on this URL')) {
        return false
      }
    }
  } catch (e) {
    return false
  }
}

/**
 * Storage
 */
export class Storage {
  constructor (fileName, data) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')

    this.path = path.join(userDataPath, fileName)
    console.log(this.path)
    fs.access(this.path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        this.setData(data)
      } else {
        this.data = JSON.parse(fs.readFileSync(this.path))
      }
    })
  }

  get (key) {
    return this.data[key]
  }
  set (key, val) {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }

  getData () {
    this.data = JSON.parse(fs.readFileSync(this.path))
    return this.data
  }
  setData (data) {
    this.data = data
    fs.writeFileSync(this.path, JSON.stringify(data))
  }
}
