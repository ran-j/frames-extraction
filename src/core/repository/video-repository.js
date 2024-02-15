const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');

module.exports = class VideoRepository {
    async extractFrames(videoPath, outputPath, ffmpegParameters = '-vf fps=1 -q:v 2') {
        return new Promise((resolve, reject) => {
            exec(`${ffmpeg} -i ${videoPath} ${ffmpegParameters} ${outputPath}/frame-%d.png`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(stdout);
                    resolve(stdout);
                }
            });
        });
    }

    async resizeFrames(width, height) {
        const files = fs.readdirSync(outputPath);
        const promises = files.map((file) => {
            return sharp(`${outputPath}/${file}`)
                .resize(width, height)
                .toFile(`${outputPath}/${file}`);
        });

        return Promise.all(promises);
    }

    async getVideoMetadata(videoPath, outputPath) {
        return new Promise((resolve, reject) => {
            exec(`${ffmpeg} -i ${videoPath}`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err, stderr);
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

}