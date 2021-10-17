// These will be overridden during CI/CD
const typescriptVersion: string = "{0}";
const gitShortHash: string = "{1}";
const buildDate: string = "{2}";

let inputCanvasContext: CanvasRenderingContext2D;

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas')!;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

fillBuildInfo('buildInfo', buildDate, gitShortHash);

startChosenAnimation();

export function startChosenAnimation(): void 
{
    window.requestAnimationFrame(simpleRotator)
}

export function simpleRotator(timestamp: DOMHighResTimeStamp): void
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(200, 200);
    ctx.rotate( (Math.PI / 180) * timestamp * 0.01);
    ctx.translate(-200, -200);
    ctx.font = "30px Arial";
    ctx.fillText("⏳", 200, 200);
    window.requestAnimationFrame(simpleRotator)
}

export function fillBuildInfo(elementName: string, day: string, shortHash: string): void 
{
    const buildInfoElement: HTMLElement = document.getElementById(elementName)!;
    buildInfoElement.innerHTML = `<time datetime="${day}">${day}</time> <a href="https://github.com/mcraiha/JS-Crop-And-Resize/commit/${shortHash}">#${shortHash}</a>`;
}
