import {
  CreateSecretCommand,
  GetSecretValueCommand,
  type GetSecretValueCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export function createSecretsManagerClient(): SecretsManagerClient | null {
  if (!process.env.AWS_REGION) {
    return null;
  }

  return new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

// Local Convex DB helper (used when AWS is not configured)
async function getLocalSecret(ctx: any, secretName: string) {
  return await ctx.runQuery("system/localSecrets:getByName" as any, {
    name: secretName,
  });
}

async function setLocalSecret(ctx: any, secretName: string, value: string) {
  return await ctx.runMutation("system/localSecrets:upsert" as any, {
    name: secretName,
    value,
  });
}

export async function getSecretValue(
  ctx: any,
  secretName: string,
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient();

  if (!client) {
    const local = await ctx.runQuery("system/localSecrets:getByName", {
      name: secretName,
    });

    if (!local) {
      throw new Error(`Secret not found: ${secretName}`);
    }

    return {
      $metadata: {},
      SecretString: local.value,
    } as GetSecretValueCommandOutput;
  }

  return await client.send(new GetSecretValueCommand({ SecretId: secretName }));
}

export async function upsertSecret(
  ctx: any,
  secretName: string,
  secretValue: Record<string, unknown>,
): Promise<void> {
  const client = createSecretsManagerClient();

  if (!client) {
    await ctx.runMutation("system/localSecrets:upsert" as any, {
      name: secretName,
      value: JSON.stringify(secretValue),
    });
    return;
  }

  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
      }),
    );
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue),
        }),
      );
    } else {
      throw error;
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null {
  if (!secret.SecretString) {
    return null;
  }

  try {
    return JSON.parse(secret.SecretString) as T;
  } catch {
    return null;
  }
}
