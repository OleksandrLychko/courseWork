export class FileService {
    public async createFile(fileName: string, content: string): Promise<void> {
        const response = await fetch('http://localhost:3000/create-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName, content }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const responseData = await response.json();
        console.log(responseData.message);
    }
}