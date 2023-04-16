import $ from 'fire-keeper'
import c2a from 'coffee-ahk'

// function

const clean = () => $.remove('./dist')

const compile = (source: string) =>
  c2a(`./source/${source}.coffee`, { salt: 'genshin' })

const main = async () => {
  await compile('index')
  await clean()
  await pack('index', 'GIS')
}

const pack = async (source: string, target: string) => {
  const pkg = await $.read<{ version: string }>('./package.json')
  if (!pkg) return
  const { version } = pkg

  const buffer = await $.read<Buffer>(`./source/${source}.ahk`)
  const extra = await $.read<Buffer>('./source/ahk/hotkeys.ahk')
  var newBuffer = Buffer.concat([buffer!, extra!]);
  const dir = `./dist/${target}_${version}`

  await $.write(`./dist/${target}.ahk`, newBuffer)

  await $.copy(
    [
      './data/character.ini',
      './data/config.ini',
      './data/readme.url',
      './source/off.ico',
      './source/on.ico',
    ],
    dir,
  )

  await $.remove(`./source/${source}.ahk`)
}

// export
export default main
