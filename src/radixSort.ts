import {Chart} from "./chart";

export class RadixSort {
    public operations: number;

    constructor() {
        this.operations = 0;
    }

    chart = new Chart('myChart');

    async countingSort(arr: number[], exp: number): Promise<void> {
        const size = arr.length;
        const output = new Array(size).fill(0);
        const count = new Array(10).fill(0);
        const addDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // count occurrences of each value
        for (let i = 0; i < size; i++) {
            this.operations++;
            count[Math.floor(arr[i] / exp) % 10]++;
        }

        // count all the digits that are less than or equal to count[i]
        for (let i = 1; i < 10; i++) {
            this.operations++;
            count[i] += count[i - 1];
        }

        // fill the output array using the count array
        for (let i = size - 1; i >= 0; i--) {
            this.operations++;
            output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
            count[Math.floor(arr[i] / exp) % 10]--;
        }

        // copy the output array to the original array
        for (let i = 0; i < size; i++) {
            arr[i] = output[i];
            if (arr.length <= 200) {
                this.chart.generateChart(arr);
                await addDelay(10);
            }
        }
    }

    async sort(arr: number[]): Promise<void> {
        const max = Math.max(...arr);
    
        // perform counting sort for each digit position
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            await this.countingSort(arr, exp);
        }
    }
}