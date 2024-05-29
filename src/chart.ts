export class Chart {
    private canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public generateChart(data: number[]): void {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const barWidth = canvasWidth / data.length;
        const maxDataValue = Math.max(...data);

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        data.forEach((value, index) => {
            const barHeight = (value / maxDataValue) * canvasHeight;
            const x = index * barWidth;
            const y = canvasHeight - barHeight;

            this.drawBar(x, y, barWidth, barHeight);
        });
    }

    private drawBar(x: number, y: number, width: number, height: number): void {
        this.ctx.fillStyle = 'rgba(54, 162, 235, 0.5)';
        this.ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
        this.ctx.lineWidth = 1;

        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeRect(x, y, width, height);
    }
}