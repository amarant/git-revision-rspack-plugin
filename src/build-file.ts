import runGitCommand from './helpers/run-git-command'
import { Compiler } from '@rspack/core'

interface BuildFileOptions {
  compiler: Compiler
  gitWorkTree?: string
  command: string
  replacePattern: RegExp
  asset: string
}

export default function buildFile({ compiler, gitWorkTree, command, /*replacePattern,*/ asset }: BuildFileOptions) {
  let data: string = ''

  compiler.hooks.compilation.tap('GitRevisionRspackPlugin', (compilation) => {
    compilation.hooks.optimizeTree.tapAsync('optimize-tree', (_, __, callback) => {
      runGitCommand(gitWorkTree, command, function (err, res) {
        if (err) {
          return callback(err)
        }
        data = res

        callback()
      })
    })

    //TODO: implement filename template when the assetPath hook is available
    // compilation.hooks.assetPath.tap('GitRevisionRspackPlugin', (assetPath: any, chunkData: any) => {
    //   const path = typeof assetPath === 'function' ? assetPath(chunkData) : assetPath

    //   if (!data) return path
    //   return path.replace(replacePattern, data)
    // })

    compilation.hooks.processAssets.tap('GitRevisionRspackPlugin', () => {
      compilation.emitAsset(asset, new compiler.webpack.sources.RawSource(data), {})
    })
  })
}
