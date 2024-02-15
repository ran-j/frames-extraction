#!/usr/bin/env node

const yargs = require('yargs');
const Container = require('../container');

async function main() {

    const argv = yargs
        .usage('Usage: $0 --input <input> [--outputPath <outputPath>] [--threshold <threshold>] [--ffmpegParameters <ffmpegParameters>]')
        .option('input', {
            describe: 'Input video path',
            demandOption: true,
            type: 'string'
        })
        .option('outputPath', {
            describe: 'Optional output path',
            type: 'string'
        })
        .option('threshold', {
            describe: 'Optional comparison threshold (0-100)',
            type: 'number'
        })
        .option('ffmpegParameters', {
            describe: 'Optional FFmpeg parameters',
            type: 'string',
            default: '-vf fps=1 -q:v 2'
        })
        .help()
        .argv;

    const input = argv.input;
    const outputPath = argv.outputPath;
    const threshold = argv.threshold;
    const ffmpegParameters = argv.ffmpegParameters;

    console.log("Processing:", input);
    
    const container = new Container();

    const thresholdParser = threshold ? parseInt(threshold) : undefined;

    const useCase = container.getExtractVideoFrameWithCompareUseCase();
    await useCase.execute({ inputPath: input, outputPath: outputPath, threshold: thresholdParser, ffmpegParameters }, async (message) => {
        console.log(message)
    });
}
main();