export const StreamLinkGuiMutations = {
  SET_STREAMS: 'setStreams',
  UPDATE_STREAM: 'updateStream',
  DEL_STREAM: 'delStream',
  UPDATE_FAVOURITE: 'updateFavourite',
  UPDATE_LIVE: 'updateLive',
  SET_ALERT: 'setAlert',
  SET_PLUGINS: 'setPlugins'
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
        break
      }
    }
  },
  [StreamLinkGuiMutations.DEL_STREAM]: (state, delId) => {
    state.streams = state.streams.filter(stream => stream.id !== delId)
  },
  [StreamLinkGuiMutations.UPDATE_FAVOURITE]: (state, id) => {
    for (let stream in state.streams) {
      if (state.streams[stream].id === id) {
        state.streams[stream].favourite = !state.streams[stream].favourite
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
  [StreamLinkGuiMutations.SET_ALERT]: (state, alert) => {
    state.alert.msg = alert.msg
    state.alert.type = alert.type
    state.alert.display = true
  },
  [StreamLinkGuiMutations.SET_PLUGINS]: (state, plugins) => {
    state.plugins = plugins
  }
}

export default mutations
