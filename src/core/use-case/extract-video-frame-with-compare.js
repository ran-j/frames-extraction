const fs = require('fs');
const path = require('path');

module.exports = class ExtractVideoFrameWithCompareUseCase {
  constructor({ videoRepository, videoCompareRepository, validationsRepository }) {
    this.videoRepository = videoRepository;
    this.videoCompareRepository = videoCompareRepository;
    this.validationsRepository = validationsRepository;
  }

  async createPathIfNotExists(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, { recursive: true }, async (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async execute({ inputPath, outputPath, threshold, ffmpegParameters }, log) {
    const fake = './frames';
    const fixedOutputPath = outputPath || fake;
    const outputPathUnique = path.join(fixedOutputPath, 'unique');

    const start = Date.now()

    log("Creating output folder if not exist")
    await this.createPathIfNotExists(fixedOutputPath);

    log("Validating data")
    await this.validationsRepository.validate(inputPath);

    if (threshold) {
      log("Setting threshold to" + threshold)
      this.videoCompareRepository.setThreshold(threshold);
    }

    log("Extracting frames")
    await this.videoRepository.extractFrames(inputPath, fixedOutputPath, ffmpegParameters);

    log("Creating output folder for uniquer frames")
    await this.createPathIfNotExists(outputPathUnique);

    log("Picking unique frames and saving to " + outputPathUnique)
    await this.videoCompareRepository.compareAndRemoveDuplicates(fixedOutputPath, outputPathUnique);

    const diff = Date.now() - start
    log("Process finished, it took " + (diff / 1000))
  }
}