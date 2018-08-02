import {StreamLinkGuiMutations} from '@/store/mutations'

export const StreamLinkGuiActions = {
  PLAY_STREAM: 'playStream',
  SET_STREAMS: 'setStreams',
  SET_PLUGINS: 'setPlugins',
  RESET_STORE: 'resetStore'
}

const childProcess = require('child_process')

function startStream (command, ctx) {
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

// ctx: ActionContext
const actions = {
  [StreamLinkGuiActions.SET_STREAMS]: (ctx) => {
    try {
      // const data = require('/static/streams')
      // ctx.commit(StreamLinkGuiMutations.SET_STREAMS, data)
    } catch (e) {
      // @TODO: solve pb
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: 'No streams.json file.', type: 'error' })
    }
  },
  [StreamLinkGuiActions.SET_PLUGINS]: (ctx) => {
    try {
      // const data = require('/static/plugins')
      // ctx.commit(StreamLinkGuiMutations.SET_PLUGINS, data)
    } catch (e) {
      // @TODO: solve pb
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: 'No plugins.json file.', type: 'error' })
    }
  },
  [StreamLinkGuiActions.PLAY_STREAM]: (ctx, stream) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: `Starting ${stream.url}`, type: 'info'})
    startStream(`streamlink.exe ${stream.url} ${stream.quality}`, ctx)
  }
}

export default actions
