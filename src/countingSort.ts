import {Chart} from "./chart";

export class CountingSort {
    public operations: number;

    constructor() {
        this.operations = 0;
    }

    chart = new Chart('myChart');

    async sort(arr: number[]): Promise<void> {
        const size = arr.length;
        const addDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        let max = Math.max(...arr);

        const count = new Array(max + 1).fill(0);

        // count the occurrences of each value
        for (let i = 0; i < size; i++) {
            this.operations++;
            count[arr[i]]++;
        }

        // count all the digits that are less than or equal to count[i]
        for (let i = 1; i <= max; i++) {
            this.operations++;
            count[i] += count[i - 1];
        }

        const output = new Array(size).fill(0);

        // fill the output array with the correct order of initial values
        for (let i = size - 1; i >= 0; i--) {
            this.operations++;
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        // copy the output array to the original array
        for (let i = 0; i < size; i++) {
            arr[i] = output[i];
            if (arr.length <= 200) {
                this.chart.generateChart(arr);
                await addDelay(20);
            }
        }
    }
}