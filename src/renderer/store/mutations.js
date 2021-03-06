import {Files} from '@/store/actions'

export const StreamLinkGuiMutations = {
  SET_STREAMS: 'setStreams',
  UPDATE_STREAM: 'updateStream',
  ADD_STREAM: 'addStream',
  DEL_STREAM: 'delStream',
  UPDATE_FAVOURITE: 'updateFavourite',
  UPDATE_LIVE: 'updateLive',
  SET_CONFIG: 'setConfig',
  SET_PLUGINS: 'setPlugins',
  SET_LIVE_LOADER: 'setLiveLoader',
  SET_STREAM_QUALITY: 'setStreamQuality',
  SET_STREAMED_STREAM: 'setStreamedStream',
  UPDATE_STREAMED_STREAM: 'updateStreamedStream'
}

const mutations = {
  [StreamLinkGuiMutations.SET_STREAMS]: (state, streams) => {
    state.streams = streams
  },
  [StreamLinkGuiMutations.UPDATE_STREAM]: (state, update) => {
    for (let stream in state.streams) {
      if (state.streams[stream].id === update.id) {
        for (let info in update) {
          state.streams[stream][info] = update[info]
        }
        Files.STREAMS.setData(state.streams)
        break
      }
    }
  },
  [StreamLinkGuiMutations.ADD_STREAM]: (state, stream) => {
    stream.id = Files.CONFIG.get('id')
    state.streams.push(stream)
    Files.STREAMS.setData(state.streams)
    Files.CONFIG.set('id', stream.id + 1)
  },
  [StreamLinkGuiMutations.DEL_STREAM]: (state, delId) => {
    state.streams = state.streams.filter(stream => stream.id !== delId)
    Files.STREAMS.setData(state.streams)
  },
  [StreamLinkGuiMutations.UPDATE_FAVOURITE]: (state, id) => {
    for (let stream in state.streams) {
      if (state.streams[stream].id === id) {
        state.streams[stream].favourite = !state.streams[stream].favourite
        Files.STREAMS.setData(state.streams)
        break
      }
    }
  },
  [StreamLinkGuiMutations.UPDATE_LIVE]: (state, data) => {
    for (let stream in state.streams) {
      if (state.streams[stream].id === data.id) {
        state.streams[stream].live = data.live
        break
      }
    }
  },
  [StreamLinkGuiMutations.SET_CONFIG]: (state, config) => {
    if (config && config !== [] && config !== {}) {
      state.config = config
    }
    Files.CONFIG.setData(state.config)
  },
  [StreamLinkGuiMutations.SET_PLUGINS]: (state, plugins) => {
    state.plugins = plugins
  },
  [StreamLinkGuiMutations.SET_LIVE_LOADER]: (state, live) => {
    state.liveLoader = live
  },
  [StreamLinkGuiMutations.SET_STREAM_QUALITY]: (state, quality) => {
    state.quality.qualities = quality.qualities
    state.quality.display = quality.display
    state.quality.default = quality.default
  },
  [StreamLinkGuiMutations.SET_STREAMED_STREAM]: (state, stream) => {
    state.streamedStream = stream
  },
  [StreamLinkGuiMutations.UPDATE_STREAMED_STREAM]: (state, update) => {
    for (let info in update) {
      state.streamedStream[info] = update[info]
    }
  }
}

export default mutations
