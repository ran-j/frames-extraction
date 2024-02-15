const fs = require('fs');
const path = require('path');

module.exports = class ValidationsRepository {

    async validate(videoPath) {
        await this.validateVideoPath(videoPath);
        await this.isVideoFile(videoPath);
    }

    async validateVideoPath(videoPath) {
        if (!videoPath) {
            throw new Error('Video path is required');
        }

        if (!fs.existsSync(videoPath, fs.constants.R_OK)) {
            throw new Error('Video path is invalid');
        }

        return true;
    }

    async isVideoFile(videoPath) {
        const fileExtension = path.extname(videoPath);
        if (fileExtension !== '.mp4') {
            throw new Error('Video file must be .mp4');
        }

        return true;
    }
}