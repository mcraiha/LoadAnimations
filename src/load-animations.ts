// These will be overridden during CI/CD
const typescriptVersion: string = "{0}";
const gitShortHash: string = "{1}";
const buildDate: string = "{2}";

let doStop: boolean = true;
let animationHandle: number = -1;

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas')!;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

const startStopButton = document.getElementById('startstop');
if (startStopButton)
{
    const startStopButtonActualInput: HTMLInputElement = <HTMLInputElement>startStopButton;
    startStopButtonActualInput.addEventListener('click', () => {
        if (doStop)
        {
            window.cancelAnimationFrame(animationHandle);
            doStop = false;
        }
        else
        {
            doStop = true;
        }
      });
}

fillBuildInfo('buildInfo', buildDate, gitShortHash);

startChosenAnimation();

export function startChosenAnimation(): void 
{
    animationHandle = window.requestAnimationFrame(simpleRotator)
}

export function simpleRotator(timestamp: DOMHighResTimeStamp): void
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(200, 200);
    ctx.rotate(timestamp * 0.01);
    ctx.translate(-200, -200);
    ctx.font = "30px Arial";
    ctx.fillText("⏳", 200, 200);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    animationHandle = window.requestAnimationFrame(simpleRotator)
}

export function fillBuildInfo(elementName: string, day: string, shortHash: string): void 
{
    const buildInfoElement: HTMLElement = document.getElementById(elementName)!;
    buildInfoElement.innerHTML = `<time datetime="${day}">${day}</time> <a href="https://github.com/mcraiha/JS-Crop-And-Resize/commit/${shortHash}">#${shortHash}</a>`;
}
