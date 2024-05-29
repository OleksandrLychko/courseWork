import fs from 'fs';
import path from 'path';

export class FileController {
  private readonly resultsDir: string;
  constructor() {
    this.resultsDir = path.resolve(process.cwd(), 'results');
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }

    console.log('resultsDir ===> ', this.resultsDir);
  }

  public async createFile(fileName: string, content: any): Promise<void> {
    const filePath = path.join(this.resultsDir, fileName);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
