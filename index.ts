import Sharp from 'sharp'
import fs from 'fs'

class PJSekaiBackgroundGenerator {
  baseImg!: Sharp.Sharp
  patternImg!: Sharp.Sharp
  maskRight!: Sharp.Sharp
  maskLeft!: Sharp.Sharp

  constructor(assetsDir: string) {
    const files = fs.readdirSync(assetsDir)
    const requiredFiles: string[] = ['base.png', 'pattern.png', 'mask-left.png', 'mask-right.png']
    requiredFiles.forEach((file: string) => {
      if (!files.includes(file)) {
        throw new Error(`${file} not found in assets directory`)
      }
    })
    this.baseImg = Sharp(`${assetsDir}/base.png`).png({ palette: true })
    this.patternImg = Sharp(`${assetsDir}/pattern.png`).png({ palette: true })
    this.maskLeft = Sharp(`${assetsDir}/mask-left.png`).png({ palette: true })
    this.maskRight = Sharp(`${assetsDir}/mask-right.png`).png({ palette: true })
  }

  /**
  * Processingの範囲割当補助
  */
  mapRange(value: number, start1: number, end1: number, start2: number, end2: number): number {
    return start2 + (end2 - start2) * ((value - start1) / (end1 - start1))
  }

  /**
  * 透明度指定するやつ
  */
  setOpacity(sharpObject: Sharp.Sharp, opacityFloat: number): Sharp.Sharp {
    const opacityInt: number = this.mapRange(opacityFloat, 0, 1, 1, 255)
    const resp = sharpObject.clone().composite([{
      input: Buffer.from([255, 255, 255, opacityInt]),
      raw: {
        width: 1,
        height: 1,
        channels: 4
      },
      tile: true,
      blend: 'dest-in'
    }])
    return resp
  }

  /**
  * マスクを指定して切り抜くやつ
  */
  async setMask(sharpObject: Sharp.Sharp, maskObject: Sharp.Sharp): Promise<Sharp.Sharp> {
    const buf = await maskObject.toBuffer()
    const resp = sharpObject.clone().composite([
      {
        input: buf,
        blend: 'xor'
      }
    ])
    return resp
  }

  /**
  * PJSekaiの背景画像を生成する
  */
  async createBackgroundImage(inputPath: string, outputPath: string): Promise<void> {
    console.log(`Processing ${inputPath}`)
    const tmp = this.baseImg.clone()
    const jacket = Sharp(inputPath).png({ palette: true })
    try {
      // 上 配置: 797 189 サイズ:450x450 不透明度:15%
      const jacketMain = this.setOpacity(
        jacket.clone().resize(450, 450),
        1.5
      )
      const jacketBuffer = await jacketMain.toBuffer()
      // 下 配置:797 683 サイズ:450x450 不透明度:1%
      const jacketMirror = this.setOpacity(
        jacketMain.clone().flip(), 0.08
      )
      const jacketMirrorBuffer = await jacketMirror.toBuffer()
      // 左 配置:441 145 サイズ: 650x650 不透明度:15%
      const jacketZoomLeft = await this.setMask(
        this.maskLeft,
        jacket.clone().resize(650, 650),
      )
      const jacketZoomLeftBuffer = await jacketZoomLeft.toBuffer()
      // 右 配置:959 60 サイズ: 700x700 不透明度:15%
      const jacketZoomRight = await this.setMask(
        this.maskRight,
        jacket.clone().resize(700, 700),
      )
      const jacketZoomRightBuffer = await jacketZoomRight.toBuffer()
      const patternBuffer = await this.patternImg.toBuffer()
      const compositeTmp = tmp.composite([
        {
          input: jacketBuffer,
          top: 189,
          left: 797
        },
        {
          input: jacketZoomLeftBuffer,
          top: 142,
          left: 446
        },
        {
          input: jacketZoomRightBuffer,
          top: 60,
          left: 959
        },
        {
          input: jacketMirrorBuffer,
          top: 700,
          left: 797
        },
        {
          input: patternBuffer,
          gravity: 'center'
        }
      ])
      await compositeTmp.toFile(outputPath)
      console.log(`Processing ${inputPath} Success`)
    } catch (e) {
      console.log(e)
    }
  }

  /**
  * 指定されたフォルダ内のすべての画像に対してPJSekaiの背景画像を生成する
  */
  createBackgroundImages(inputDir: string, outputDir: string): void {
    const files = fs.readdirSync(inputDir)
    files.filter((file: string) => {
      return file.endsWith('.png')
        || file.endsWith('.jpg')
        || file.endsWith('.jpeg')
    }).forEach((file: string) => {
      const inputPath = `${inputDir}/${file}`
      const outputPath = `${outputDir}/${file}`
      this.createBackgroundImage(inputPath, outputPath).catch(err => {
        throw err
      })
    })
  }
}

export { PJSekaiBackgroundGenerator }

if (require.main === module) {
  console.log('==PJSekai Background Generator==')
  const gen = new PJSekaiBackgroundGenerator('./assets')
  gen.createBackgroundImages('./in', './out')
}