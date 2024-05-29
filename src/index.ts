import { BucketSort } from "./bucketSort";
import { RadixSort } from "./radixSort";
import { CountingSort } from "./countingSort";
import './styles/styles.css';

const BucketSorting = new BucketSort();
const RadixSorting = new RadixSort();
const CountingSorting = new CountingSort();

document.addEventListener("DOMContentLoaded", function() {
    const lowerBoundInput = document.getElementById('lowerBound') as HTMLInputElement;
    const upperBoundInput = document.getElementById('upperBound') as HTMLInputElement;
    const arrSizeInput = document.getElementById('arrSizeInput') as HTMLInputElement;
    const sortButton = document.getElementById('sortButton') as HTMLButtonElement;
    const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
    const selectSort = document.getElementById('selectSort') as HTMLSelectElement;
    const selectFill = document.getElementById('selectFill') as HTMLSelectElement;
    const resultArea = document.getElementById('result') as HTMLInputElement;
    const lowerBoundError = document.getElementById('lowerBoundError');
    const upperBoundError = document.getElementById('upperBoundError');
    const arrSizeError = document.getElementById('arrSizeError');
    const boundsError = document.getElementById('boundsError');

    lowerBoundInput.addEventListener('input', validateInputs);
    upperBoundInput.addEventListener('input', validateInputs);
    arrSizeInput.addEventListener('input', validateInputs);

    let output = "";
    let isAnimationRunning = false;
    let sortingStarted = false;
    saveButton.disabled = true;
    let initialArray: number[] = [];
    let sortedArray: number[] = [];
    let operations = 0;

    sortButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (isAnimationRunning) {
            return;
        }

        sortButton.disabled = true;
        saveButton.disabled = true;
        sortingStarted = true;
        isAnimationRunning = true;
        initialArray = generateArray();
        sortedArray = new Array(initialArray.length);

        for (let i = 0; i < initialArray.length; i++) {
            sortedArray[i] = initialArray[i];
        }

        console.log("Generated array: ", initialArray);
        try {
            await sortArray(sortedArray);
            output = "Operations: " + operations + "\nSorted array: " + sortedArray.slice(0, 20).join(", ") + "...";
            resultArea.value = output;
            console.log("Sorted array: ", sortedArray);
        } catch (error) {
            console.error("An error occurred during sorting:", error);
        } finally {
            isAnimationRunning = false;
        }

        saveButton.disabled = false;
        sortButton.disabled = false;
    });

    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (isAnimationRunning) {
            return;
        }

        if ('showSaveFilePicker' in window) {
            try {
                const fileHandle = await (window as any).showSaveFilePicker();

                const writable = await fileHandle.createWritable();

                await writable.write("Generated array: " + initialArray[0]);
                for (let i = 1; i < initialArray.length; i++) {
                    await writable.write(", " + initialArray[i]);
                }

                await writable.write("\nSorted array: " + sortedArray[0]);
                for (let i = 1; i < sortedArray.length; i++) {
                    await writable.write(", " + sortedArray[i]);
                }

                await writable.close();
            } catch (err) {
                console.error('Error saving file', err);
            }
        } else {
            console.error('API is not supported');
        }
    });

    function validateInputs() {
        const isLowerBoundValid = lowerBoundInput.checkValidity();
        const isUpperBoundValid = upperBoundInput.checkValidity();
        const isArrSizeValid = arrSizeInput.checkValidity();
        const lowerBound = parseInt(lowerBoundInput.value);
        const upperBound = parseInt(upperBoundInput.value);
        const isBoundsValid = lowerBound <= upperBound;
        const isArrSizeEmpty = arrSizeInput.value.trim() == '';
        const isInputsValid = isLowerBoundValid && isUpperBoundValid && isArrSizeValid && isBoundsValid && !isArrSizeEmpty;

        sortButton.disabled = !isInputsValid;
        lowerBoundError!.style.display = isLowerBoundValid ? 'none' : 'block';
        upperBoundError!.style.display = isUpperBoundValid ? 'none' : 'block';
        arrSizeError!.style.display = isArrSizeValid ? 'none' : 'block';
        boundsError!.style.display = isBoundsValid ? 'none' : 'block';
    }

    function generateArray(): number[] {
        let generatedArray: number[] = [];
        const length = parseInt(arrSizeInput.value);
        const min = parseInt(lowerBoundInput.value);
        const max = parseInt(upperBoundInput.value);

        switch (selectFill.value) {
            case 'best':
                generatedArray = generateBest(length, min, max);
                break;
            case 'random':
                generatedArray = generateRandom(length, min, max);
                break;
            case 'worst':
                generatedArray = generateWorst(length, min, max);
                break;
            default:
                return [];
        }
        return generatedArray;
    }

    async function sortArray(arrayToSort: number[]) {
        switch (selectSort.value) {
            case 'bucket':
                BucketSorting.chart.ctx.clearRect(0, 0, BucketSorting.chart.ctx.canvas.width, BucketSorting.chart.ctx.canvas.height);
                await BucketSorting.sort(arrayToSort);
                operations = BucketSorting.operations;
                BucketSorting.operations = 0;
                break;
            case 'radix':
                RadixSorting.chart.ctx.clearRect(0, 0, RadixSorting.chart.ctx.canvas.width, RadixSorting.chart.ctx.canvas.height);
                await RadixSorting.sort(arrayToSort);
                operations = RadixSorting.operations;
                RadixSorting.operations = 0;
                break;
            case 'counting':
                CountingSorting.chart.ctx.clearRect(0, 0, CountingSorting.chart.ctx.canvas.width, CountingSorting.chart.ctx.canvas.height);
                await CountingSorting.sort(arrayToSort);
                operations = CountingSorting.operations;
                CountingSorting.operations = 0;
                break;
            default:
                return;
        }
    }

    function generateRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateRandom(length: number, min: number, max: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < length; i++) {
            result.push(generateRandomInt(min, max));
        }
        return result;
    }

    function generateBest(length: number, min: number, max: number): number[] {
        const intervalSize = Math.ceil(length / (max - min + 1));
        const bestArray: number[] = [];
        for (let i = min; i <= max; i++) {
            const count = Math.min(intervalSize, length - bestArray.length);
            for (let j = 0; j < count; j++) {
                bestArray.push(i);
            }
        }
        return bestArray;
    }

    function generateWorst(length: number, min: number, max: number): number[] {
        const bestArray: number[] = generateBest(length, min, max);
        const worstArray = [];
        for (let i = bestArray.length - 1; i >= 0; i--) {
            worstArray.push(bestArray[i]);
        }
        return worstArray;
    }
});