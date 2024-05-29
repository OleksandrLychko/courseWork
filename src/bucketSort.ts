import {Chart} from "./chart";

export class BucketSort {
    public operations: number;

    constructor() {
        this.operations = 0;
    }

    public chart = new Chart('myChart');

    async sort(arr: number[]): Promise<void> {
        const size = arr.length;
        const addDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const maxValue = Math.max(...arr);
        const buckets: number[][] = Array.from({ length: size }, () => []);

        // normalize array values and divide them into buckets
        for (let i = 0; i < size; i++) {
            this.operations++;
            const normalizedVal = Math.floor((arr[i] / maxValue) * (size - 1));
            buckets[normalizedVal].push(arr[i]);
        }

        // sort each bucket with insertion sort
        for (let i = 0; i < size; i++) {
            this.sortBucket(buckets[i]);
        }

        // fill the sorted array with sorted buckets
        let index = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                this.operations++;
                arr[index++] = buckets[i][j];
            }
            if (arr.length <= 200) {
                this.chart.generateChart(arr);
                await addDelay(20);
            }
        }
    }

    // insertion sorting algorithm for sorting buckets
    private sortBucket(arr: number[]): void {
        for (let i = 1; i < arr.length; i++) {
            let current = arr[i];
            let j = i - 1;

            while (j >= 0 && arr[j] > current) {
                this.operations++;
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = current;
        }
    }
}