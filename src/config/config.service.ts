import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(public filePath: string) {
    let file: Buffer | undefined;
    try {
      file = fs.readFileSync(filePath);
    } catch (error) {
      file = fs.readFileSync('.env.development');
    }

    const config = dotenv.parse(file);
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      DB_URL: Joi.string().required(),
      JWT_KEY: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.number(),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(
        `Config validation error in your env file: ${error.message}`
      );
    }
    return validatedEnvConfig;
  }

  get jwtExpiresIn(): number | undefined {
    if (this.envConfig.JWT_EXPIRES_IN) {
      return +this.envConfig.JWT_EXPIRES_IN;
    }
    return undefined;
  }

  get dbUrl(): string {
    return this.envConfig.DB_URL;
  }

  get jwtKey(): string {
    return this.envConfig.JWT_KEY;
  }
}
