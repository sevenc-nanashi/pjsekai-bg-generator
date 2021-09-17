import Sharp from 'sharp'
import fs from 'fs'

class PJSekaiBackgroundGenerator {
    baseImg: Sharp.Sharp
    frameImg: Sharp.Sharp

    constructor (assetsDir: string) {
        const files = fs.readdirSync(assetsDir)
        if (!files.includes('base.png')) {
            throw new Error('base.png not found in assets directory')
        }
        if (!files.includes('frame.png')) {
            throw new Error('frame.png not found in assets directory')
        }
        this.baseImg = Sharp(files[0])
        this.frameImg = Sharp(files[0])
    }

    createBackgroundImage (inputPath: string, outputPath: string) {
         // this.baseImg.resize(1920, 1080).toFile(outputPath)
         console.log('TODO')
    }

    createBackgroundImages (inputDir: string, outputDir: string) {
        // this.baseImg.resize(1920, 1080).toFile(outputPath)
        console.log('TODO')
   }
}

export { PJSekaiBackgroundGenerator }


if(require.main === module) {
  console.log('main module')
  const gen = new PJSekaiBackgroundGenerator('./assets')
  gen.createBackgroundImages('./in', './out')
}