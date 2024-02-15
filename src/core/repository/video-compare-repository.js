const fs = require('fs');
const resemble = require('resemblejs');


// const comparer = new CompareFrames(inputImagePath, outputImagePath);
// comparer.compareAndRemoveDuplicates()
//     .then(() => {
//         console.log('Unique frames saved successfully!');
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
module.exports = class VideoCompareRepository {
    constructor(threshold = 52) {
        this.threshold = threshold;
    }

    setThreshold(threshold) {
        this.threshold = threshold;
    }
    
    async compareAndRemoveDuplicates(inputPath, outputPath) {
        const files = await this.readImageFiles(inputPath, outputPath);
        const uniqueFrames = await this.removeDuplicateFrames(files, inputPath);
        await this.saveUniqueFrames(uniqueFrames, inputPath, outputPath);
    }

    async readImageFiles(inputPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(inputPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    async removeDuplicateFrames(files, inputPath) {
        const uniqueFrames = [files[0]];
        for (let i = 1; i < files.length; i++) {
            const currentFrame = files[i];
            const comparisonResult = await this.compareImages(files[0], currentFrame, inputPath);

            if (comparisonResult.rawMisMatchPercentage > this.threshold) {
                uniqueFrames.push(currentFrame);
            }
        }

        return uniqueFrames;
    }

    async compareImages(image1, image2, inputPath) {
        return new Promise((resolve, reject) => {
            resemble(`${inputPath}/${image1}`)
                .compareTo(`${inputPath}/${image2}`)
                .ignoreAntialiasing()
                .onComplete((comparisonResult) => {
                    resolve(comparisonResult);
                });
        });
    }

    async saveUniqueFrames(uniqueFrames, inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            fs.mkdir(outputPath, { recursive: true }, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    for (const frame of uniqueFrames) {
                        fs.copyFileSync(`${inputPath}/${frame}`, `${outputPath}/${frame}`);
                    }
                    resolve();
                }
            });
        });
    }
}
