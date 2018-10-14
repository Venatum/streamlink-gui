import {StreamLinkGuiMutations} from '@/store/mutations'
import {getQualities, onLive, startStream, Storage} from '../tools'

export const Files = {
  CONFIG: new Storage('config.json', {
    id: 0,
    exe: 'streamlink.exe',
    liveRefresh: 10,
    language: 'english'
  }),
  STREAMS: new Storage('streams.json', [])
}

export const StreamLinkGuiActions = {
  PLAY_STREAM: 'playStream',
  SET_STREAMS: 'setStreams',
  SET_CONFIG: 'setConfig',
  SET_PLUGINS: 'setPlugins',
  ON_LIVE: 'onLive',
  IS_LIVE: 'isLive',
  RESET_LIVE: 'resetLive',
  RESET_STORE: 'resetStore',
  QUALITY_CHOICE: 'qualityChoice'
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
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: 'No plugins.json file.', type: 'error'})
    }
  },
  [StreamLinkGuiActions.PLAY_STREAM]: async (ctx, stream) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: `Starting ${stream.url}`, type: 'info'})
    startStream(`${ctx.state.config.exe} ${stream.url} ${stream.quality}`, ctx)
  },
  [StreamLinkGuiActions.ON_LIVE]: async (ctx, streams) => {
    ctx.commit(StreamLinkGuiMutations.SET_LIVE_LOADER, true)
    for (let stream in streams) {
      if (await onLive(`${ctx.state.config.exe} ${streams[stream].url}`)) {
        ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: streams[stream].id, live: true})
      } else {
        ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: streams[stream].id, live: false})
      }
    }
    ctx.commit(StreamLinkGuiMutations.SET_LIVE_LOADER, false)
  },
  [StreamLinkGuiActions.IS_LIVE]: async (ctx, stream) => {
    if (await onLive(`${ctx.state.config.exe} ${stream.url}`)) {
      ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: stream.id, live: true})
    } else {
      ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: stream.id, live: false})
    }
  },
  [StreamLinkGuiActions.RESET_LIVE]: async (ctx, streams) => {
    for (let stream in streams) {
      ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: streams[stream].id, live: false})
    }
  },
  [StreamLinkGuiActions.QUALITY_CHOICE]: async (ctx, stream) => {
    ctx.commit(StreamLinkGuiMutations.SET_ALERT, {msg: `Starting ${stream.url}`, type: 'info'})
    if (await onLive(`${ctx.state.config.exe} ${stream.url}`)) {
      ctx.commit(StreamLinkGuiMutations.SET_STREAMED_STREAM, stream)
      ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: stream.id, live: true})
      ctx.commit(StreamLinkGuiMutations.SET_STREAM_QUALITY, {display: true, qualities: getQualities(`${ctx.state.config.exe} ${stream.url}`)})
    } else {
      ctx.commit(StreamLinkGuiMutations.SET_ALERT, { msg: `No playable streams found on this URL: ${stream.url}`, type: 'error' })
      ctx.commit(StreamLinkGuiMutations.UPDATE_LIVE, {id: stream.id, live: false})
    }
  }
}

export default actions
