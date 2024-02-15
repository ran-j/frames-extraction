const Container = require('../container');
 
async function main() {
    const parameter = "./The.Mummy..mp4"
    const container = new Container();

    const useCase = container.getExtractVideoFrameWithCompareUseCase();
    await useCase.execute({ inputPath: parameter });
}
main();