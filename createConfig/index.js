const fs = require('fs')
const Path = require('path')
const rp = require('request-promise')
const $ = require('cheerio')
const url = 'https://streamlink.github.io/plugin_matrix.html'
const iconsPath = '../static/Icons/'
const path = '../src/renderer/assets/plugins.json'
// const path = './plugins.json'

// Config
const searchIcons = false

let json = []

let name
let urls = []
let live = false
let vod = false
let notes = null
let i = 0

function resetVars () {
  name = null
  urls = []
  live = false
  vod = false
  notes = null
  i = 0
}

function checkIcons () {
  console.log('Checking Icons')
  let images = []
  fs.readdirSync(iconsPath).forEach((image) => {
    images.push(image)
  })
  json.forEach((data) => {
    let index = images.find((e) => {
      return Path.parse(e).name === data.name
    })
    if (index) {
      data.icon = index
    }
  })
  console.log('Checking done')
}

function writeFile (path, data) {
  console.log('Write [', path, '] starting...')
  fs.writeFileSync(path, JSON.stringify(data), 'utf8')
  console.log('Write [', path, '] ending')
}

function urlIcons (json) {
  json.forEach((el) => {
    if (el.icon === null) {
      console.log(`https://www.google.com/search?tbm=isch&source=hp&q=${el.name}+logo`, el.name)
    }
  })
}

rp(url).then((html) => {
  console.log('Web scraping start:', url)

  let tbody = $('tbody', html)[0]

  tbody.children.map((tr) => {
    if (tr.type === 'tag' && tr.name === 'tr') {
      resetVars()
      tr.children.map((td) => {
        if (td.children) {
          switch (i) {
            case 0:
              name = td.children[0].data
              break
            case 1:
              if (td.children[0].type === 'tag' && td.children[0].name === 'ul') {
                td.children[0].children.map((li) => {
                  if (li.children) {
                    urls.push(li.children[0].data)
                  }
                })
              } else {
                urls.push(td.children[0].data)
              }
              break
            case 2:
              live = (td.children[0].data === 'Yes')
              break
            case 3:
              vod = (td.children[0].data === 'Yes')
              break
            case 4:
              notes = (td.children[0].data === ' ') ? null : td.children[0].data
              break
          }
          i++
        }
      })
      json.push({name: name, urls: urls, live: live, vod: vod, notes: ((notes) || null), icon: null})
    }
  })
  checkIcons()
  writeFile(path, json)
  console.log('Please check URLS')
  if (searchIcons) {
    urlIcons(json)
  }
}).catch((err) => {
  console.error(err)
})
