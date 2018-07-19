export const StreamLinkGuiMutations = {
  SET_STREAMS: 'setStreams',
  SET_PLUGINS: 'setPlugins'
}

const mutations = {
  [StreamLinkGuiMutations.SET_STREAMS]: (state, streams) => {
    state.streams = streams
  },
  [StreamLinkGuiMutations.SET_PLUGINS]: (state, plugins) => {
    state.plugins = plugins
  }
}

export default mutations
