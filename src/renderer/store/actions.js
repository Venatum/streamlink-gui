import {StreamLinkGuiMutations} from '@/store/mutations'
import {onLive, startStream, Storage} from '../tools'

export const Files = {
  CONFIG: new Storage('config.json'),
  STREAMS: new Storage('streams.json')
}

export const StreamLinkGuiActions = {
  PLAY_STREAM: 'playStream',
  SET_STREAMS: 'setStreams',
  SET_CONFIG: 'setConfig',
  SET_PLUGINS: 'setPlugins',
  ON_LIVE: 'onLive',
  RESET_STORE: 'resetStore'
}

// ctx: ActionContext
const actions = {
  [StreamLinkGuiActions.SET_STREAMS]: (ctx) => {
    try {
      let data = Files.STREAMS.getData()
      ctx.commit(StreamLinkGuiMutations.SET_STREAMS, data)
    } catch (e) {
      Files.STREAMS.setData({})
    }
  },
  [StreamLinkGuiActions.SET_CONFIG]: (ctx) => {
    try {
      let data = Files.CONFIG.getData()
      ctx.commit(StreamLinkGuiMutations.SET_CONFIG, data)
    } catch (e) {
      Files.CONFIG.setData(this.state.config)
    }
  },
  [StreamLinkGuiActions.SET_PLUGINS]: (ctx) => {
    try {
      const data = require('@/assets/plugins.json')
      ctx.commit(StreamLinkGuiMutations.SET_PLUGINS, data)
    } catch (e) {
      // @TODO: solve pb
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: 'No plugins.json file.', type: 'error' })
    }
  },
  [StreamLinkGuiActions.PLAY_STREAM]: (ctx, stream) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: `Starting ${stream.url}`, type: 'info'})
    startStream(`streamlink.exe ${stream.url} ${stream.quality}`, ctx)
  },
  [StreamLinkGuiActions.ON_LIVE]: async (ctx, streams) => {
    for (let stream in streams) {
      if (await onLive(`streamlink.exe ${streams[stream].url}`)) {
        ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: streams[stream].id, live: true})
      } else {
        ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: streams[stream].id, live: false})
      }
    }
  }
}

export default actions
