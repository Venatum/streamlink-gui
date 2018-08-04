import {StreamLinkGuiMutations} from '@/store/mutations'
import {startStream, Storage} from '../tools'

export const Files = {
  CONFIG: new Storage('config.json'),
  STREAMS: new Storage('streams.json'),
  PLUGINS: new Storage('plugins.json')
}

export const StreamLinkGuiActions = {
  PLAY_STREAM: 'playStream',
  SET_STREAMS: 'setStreams',
  SET_PLUGINS: 'setPlugins',
  RESET_STORE: 'resetStore'
}

// ctx: ActionContext
const actions = {
  [StreamLinkGuiActions.SET_STREAMS]: (ctx) => {
    try {
      // let data = require('/static/streams.json')
      let data = Files.STREAMS.getData()
      console.log(data)
      ctx.commit(StreamLinkGuiMutations.SET_STREAMS, data)
    } catch (e) {
      // @TODO: solve pb
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: 'No streams.json file.', type: 'error' })
    }
  },
  // [StreamLinkGuiActions.SET_PLUGINS]: (ctx) => {
  //   try {
  //     // const data = require('/static/plugins')
  //     // ctx.commit(StreamLinkGuiMutations.SET_PLUGINS, data)
  //   } catch (e) {
  //     // @TODO: solve pb
  //     ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: 'No plugins.json file.', type: 'error' })
  //   }
  // },
  [StreamLinkGuiActions.PLAY_STREAM]: (ctx, stream) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: `Starting ${stream.url}`, type: 'info'})
    startStream(`streamlink.exe ${stream.url} ${stream.quality}`, ctx)
  }
}

export default actions
