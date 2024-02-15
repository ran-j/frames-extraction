const VideoRepository = require('./core/repository/video-repository');
const VideoCompareRepository = require('./core/repository/video-compare-repository');
const ValidationsRepository = require('./core/repository/validations-repository');
const ExtractVideoFrameWithCompareUseCase = require('./core/use-case/extract-video-frame-with-compare');

var dependencies = new Map();
module.exports = class Container {

    make(key, makeDependency) {
        const dependency = dependencies.get(key);
        if (dependency) return dependency;

        const dependencyInstance = makeDependency();
        dependencies.set(key, dependencyInstance);

        return dependencyInstance;
    }

    getVideoRepository() {
        return this.make('VideoRepository', () => new VideoRepository());
    }

    getVideoCompareRepository() {
        return this.make('VideoCompareRepository', () => new VideoCompareRepository());
    }

    getValidationsRepository() {
        return this.make('ValidationsRepository', () => new ValidationsRepository());
    }

    getExtractVideoFrameWithCompareUseCase() {
        return this.make('ExtractVideoFrameWithCompareUseCase', () => new ExtractVideoFrameWithCompareUseCase({
            videoRepository: this.getVideoRepository(),
            videoCompareRepository: this.getVideoCompareRepository(),
            validationsRepository: this.getValidationsRepository()
        }));
    }

}