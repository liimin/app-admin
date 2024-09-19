import { Injectable } from '@nestjs/common';
import { tar } from 'compressing';
import { ConfigService } from 'nestjs-config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  upload(file) {
    console.log(file);
  }

  async downloadAll() {
    const uploadDir = this.configService.get('file').root;
    const tarStream = new tar.Stream();
    await tarStream.addEntry(uploadDir);
    return { filename: 'hello-world.tar', tarStream };
  }
  moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const rs = fs.createReadStream(sourcePath);
      const ws = fs.createWriteStream(destinationPath);
      rs.on('error', reject);
      ws.on('error', reject);
      ws.on('finish', resolve);
      rs.pipe(ws);
    });
  }
}
