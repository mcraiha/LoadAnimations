// These will be overridden during CI/CD
const typescriptVersion: string = "{0}";
const gitShortHash: string = "{1}";
const buildDate: string = "{2}";


const effectDefinitions: ReadonlyArray<[string,  (timestamp: DOMHighResTimeStamp) => void]> = new Array<[string,  (timestamp: DOMHighResTimeStamp) => void]>(
    ["Simple rotator", simpleRotator],
    ["Simple fader", simpleFader],
    ["Simple scaler", simpleScaler],
    ["Simple wave", simpleWave],
    ["Simple path follow", simplePathFollow],
);

let doStop: boolean = true;
let animationHandle: number = -1;
let currentAnimationIndex: number = -1;

const selectDropdown = document.getElementById('chosenanimation')!;
if (selectDropdown)
{
    selectDropdown.addEventListener('change', (event) => {
        const selectTarget: HTMLSelectElement = event.target as HTMLSelectElement;
        startChosenAnimation(Number(selectTarget.value), true);
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
        }
        else
        {
            startChosenAnimation(currentAnimationIndex, false);
        }
        changeButtonState(doStop);
      });
}

fillBuildInfo('buildInfo', buildDate, gitShortHash);

startChosenAnimation(0, true);

export function startChosenAnimation(selected: number, startFromFresh: boolean): void 
{
    // Stop current animation if it happening
    if (animationHandle > -1)
    {
        window.cancelAnimationFrame(animationHandle);
    }

    currentAnimationIndex = selected;
    animationHandle = window.requestAnimationFrame(effectDefinitions[selected][1]);

    if (startFromFresh)
    {
        changeButtonState(false);
    }
}

export function changeButtonState(showStop: boolean): void
{
    const startStopButtonActualInput: HTMLInputElement = <HTMLInputElement>startStopButton;
    if (showStop)
    {
        startStopButtonActualInput.innerHTML = "Start";
        doStop = false;
    }
    else
    {
        startStopButtonActualInput.innerHTML = "Stop";
        doStop = true;
    }
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

export function simplePathFollow(timestamp: DOMHighResTimeStamp): void
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const remainder: number = (timestamp / 1000) % 4;

    const cornerSafezone: number = 20;
    const ballRadius: number = 15;
    const maxWidthMovement: number = canvas.width - cornerSafezone - cornerSafezone;
    const maxHeightMovement: number = canvas.height - cornerSafezone - cornerSafezone;
    //console.log(remainder);
    if (remainder < 1.0)
    {
        ctx.arc(cornerSafezone, maxHeightMovement - (maxHeightMovement * remainder) + cornerSafezone, ballRadius, 0, 2 * Math.PI);
    }
    else if (1.0 <= remainder && remainder < 2.0)
    {
        ctx.arc(cornerSafezone + maxWidthMovement * (remainder - 1), cornerSafezone, ballRadius, 0, 2 * Math.PI);
    }
    else if (2.0 <= remainder && remainder < 3.0)
    {
        ctx.arc(canvas.width - cornerSafezone, cornerSafezone + maxHeightMovement * (remainder - 2), ballRadius, 0, 2 * Math.PI);
    }
    else if (3.0 <= remainder && remainder < 4.0)
    {
        ctx.arc(canvas.width - cornerSafezone - maxWidthMovement * (remainder - 3), canvas.height - cornerSafezone, ballRadius, 0, 2 * Math.PI);
    }
    
    ctx.fillStyle = `rgba(255, 255, 255, 255)`;
    ctx.fill();
    animationHandle = window.requestAnimationFrame(simplePathFollow);
}

export function fillBuildInfo(elementName: string, day: string, shortHash: string): void 
{
    const buildInfoElement: HTMLElement = document.getElementById(elementName)!;
    buildInfoElement.innerHTML = `<time datetime="${day}">${day}</time> <a href="https://github.com/mcraiha/LoadAnimations/commit/${shortHash}">#${shortHash}</a>`;
}
