// These will be overridden during CI/CD
const typescriptVersion: string = "{0}";
const gitShortHash: string = "{1}";
const buildDate: string = "{2}";


const effectDefinitions: ReadonlyArray<[string,  (timestamp: DOMHighResTimeStamp) => void]> = new Array<[string,  (timestamp: DOMHighResTimeStamp) => void]>(
    ["Simple rotator", simpleRotator],
    ["Simple fader", simpleFader],
    ["Simple scaler", simpleScaler],
    ["Simple wave", simpleWave],
);

let doStop: boolean = true;
let animationHandle: number = -1;
let animatorMethod: (timestamp: DOMHighResTimeStamp) => void = function (x) {};

const selectDropdown = document.getElementById('chosenanimation')!;
if (selectDropdown)
{
    selectDropdown.addEventListener('change', (event) => {
        const selectTarget: HTMLSelectElement = event.target as HTMLSelectElement;
        startChosenAnimation(Number(selectTarget.value));
      });
}

for (let i = 0; i < effectDefinitions.length; i++) 
{
    const opt: HTMLOptionElement = document.createElement('option');
    opt.value = i.toString();
    opt.innerHTML = effectDefinitions[i][0];
    selectDropdown.appendChild(opt);
}

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

startChosenAnimation(0);

export function startChosenAnimation(selected: number): void 
{
    animationHandle = window.requestAnimationFrame(effectDefinitions[selected][1]);
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
    animationHandle = window.requestAnimationFrame(simpleRotator);
}

export function simpleFader(timestamp: DOMHighResTimeStamp): void
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, 2 * Math.PI);
    const alpha: number = Math.abs(Math.cos(timestamp * 0.001));
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
    animationHandle = window.requestAnimationFrame(simpleFader);
}

export function simpleScaler(timestamp: DOMHighResTimeStamp): void
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const scale: number = Math.abs(Math.cos(timestamp * 0.001));
    ctx.arc(200, 200, 20 + 80 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();
    animationHandle = window.requestAnimationFrame(simpleScaler);
}

export function simpleWave(timestamp: DOMHighResTimeStamp): void
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let timeOffset: number = timestamp + 0.01;
    let yDelta: number = Math.cos(timeOffset * 0.003);
    ctx.beginPath();
    ctx.arc(40, 200 + yDelta * 40, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();

    timeOffset = timeOffset + 200;
    yDelta = Math.cos(timeOffset * 0.003);
    ctx.beginPath();
    ctx.arc(120, 200 + yDelta * 40, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();

    timeOffset = timeOffset + 200;
    yDelta = Math.cos(timeOffset * 0.003);
    ctx.beginPath();
    ctx.arc(200, 200 + yDelta * 40, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();

    timeOffset = timeOffset + 200;
    yDelta = Math.cos(timeOffset * 0.003);
    ctx.beginPath();
    ctx.arc(280, 200 + yDelta * 40, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();

    timeOffset = timeOffset + 200;
    yDelta = Math.cos(timeOffset * 0.003);
    ctx.beginPath();
    ctx.arc(360, 200 + yDelta * 40, 20, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();
    animationHandle = window.requestAnimationFrame(simpleWave);
}

export function fillBuildInfo(elementName: string, day: string, shortHash: string): void 
{
    const buildInfoElement: HTMLElement = document.getElementById(elementName)!;
    buildInfoElement.innerHTML = `<time datetime="${day}">${day}</time> <a href="https://github.com/mcraiha/LoadAnimations/commit/${shortHash}">#${shortHash}</a>`;
}
