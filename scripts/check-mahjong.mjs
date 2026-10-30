import { readFileSync } from 'node:fs'

let failed = 0
function check(label, ok, detail) {
  if (ok) {
    console.log('OK  ' + label)
    return
  }
  failed += 1
  console.error('FAIL ' + label + (detail ? ' — ' + detail : ''))
}

function read(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

const modal = read('src/components/MahjongModal.jsx')
const menu = read('src/screens/MenuScreen.jsx')
const app = read('src/App.jsx')
const css = read('src/styles/mahjong.css')
const appCss = read('src/App.css')

check('MahjongModal.jsx exists', modal.length > 0)
check('MahjongModal declares MAHJONG_GAME_URL', modal.includes('MAHJONG_GAME_URL'))
check('MahjongModal renders iframe', modal.includes('<iframe'))
check('MahjongModal has close button', modal.includes('mahjong-close'))
check('MahjongModal has transition overlay', modal.includes('mahjong-transition'))

check('MenuScreen declares mahjong card', menu.includes("'menu.mahjong'") && menu.includes('onSelectMahjong'))
check('App imports MahjongModal', app.includes('MahjongModal'))
check('App has mahjong screen render', app.includes("screen === 'mahjong'"))
check('App has handleSelectMahjong', app.includes('handleSelectMahjong'))
check('App passes onSelectMahjong to MenuScreen', app.includes('onSelectMahjong={handleSelectMahjong}'))

check('mahjong.css exists', css.length > 0)
check('mahjong.css has iframe sizing', css.includes('.mahjong-iframe'))
check('mahjong.css has transition styles', css.includes('.mahjong-transition'))
check('App.css imports mahjong.css', appCss.includes('mahjong.css'))

for (const lang of ['en', 'id', 'zh']) {
  const locale = read('src/i18n/locales/' + lang + '.js')
  check(lang + '.js has menu.mahjong', /mahjong:\s*'[^']+'/.test(locale))
  check(lang + '.js has menu.mahjongDesc', /mahjongDesc:\s*'[^']+'/.test(locale))
  check(lang + '.js has mahjong namespace', /mahjong:\s*\{/.test(locale))
}

if (failed > 0) {
  console.error('\n' + failed + ' check(s) failed')
  process.exit(1)
}
console.log('\nAll mahjong self-checks passed')
