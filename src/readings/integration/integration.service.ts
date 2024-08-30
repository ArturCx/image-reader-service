import {
  Injectable,
  HttpException,
  HttpStatus,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { Buffer } from 'buffer';
import { writeFileSync, unlinkSync } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 } from 'uuid';
import { MeasureType } from '@prisma/client';

const { GEMINI_API_KEY } = process.env;

const supportedFileTypes = {
  '/': 'jpeg',
  i: 'png',
  U: 'webp',
} as const;

const fileTypeFromBase64 = (
  base64: string,
): (typeof supportedFileTypes)[keyof typeof supportedFileTypes] => {
  if (!Object.keys(supportedFileTypes).includes(base64.charAt(0))) {
    throw new UnsupportedMediaTypeException(
      'Não foi possível determinar o tipo de arquivo.',
    );
  }

  return supportedFileTypes[base64.charAt(0)];
};

@Injectable()
export class IntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async uploadImage(base64Image: string) {
    try {
      const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

      const imageBuffer = Buffer.from(base64Image, 'base64');

      const fileType = fileTypeFromBase64(base64Image);

      // criar um arquivo temporário para armazenar o buffer
      const tempFilePath = path.join(os.tmpdir(), `${v4()}.${fileType}`);
      writeFileSync(tempFilePath, imageBuffer);

      // fazer o upload do arquivo temporário
      const uploadResponse = await fileManager.uploadFile(tempFilePath, {
        mimeType: `image/${fileType}`,
        displayName: 'Image',
      });

      console.log(
        `Arquivo carregado ${uploadResponse.file.displayName} em: ${uploadResponse.file.uri}`,
      );

      // remover o arquivo temporário após o upload
      unlinkSync(tempFilePath);

      return uploadResponse;
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          error_code: 'API_ERROR',
          error_description: 'Erro ao fazer upload da imagem',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processImage(image: string, type: MeasureType) {
    const uploadResponse = await this.uploadImage(image);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
      });

      // gera o conteúdo usando a URI de referência do arquivo que foi feito upload
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        {
          text: `Read and extract the value displayed on the ${type.toLowerCase()} meter. You should consider only the first 4 digits displayed on the meter. Please only answer with the value, no additional text.`,
        },
      ]);

      console.log(result.response.text());

      const measureValue = result.response.text();
      const imageUrl = uploadResponse.file.uri;

      return { imageUrl, measureValue };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          error_code: 'API_ERROR',
          error_description: 'Erro ao consultar a API do Gemini',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
