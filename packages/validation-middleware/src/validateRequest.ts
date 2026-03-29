import type { NextFunction, Request, Response } from 'express';
import { badRequestError } from '@talentsync/types';

type ValidationIssue = {
  path?: ReadonlyArray<PropertyKey>;
  message: string;
};

type SafeParseResult = { success: true; data: unknown } | { success: false; error: { issues: ValidationIssue[] } };

type ValidationSchemaLike = {
  safeParse: (value: unknown) => SafeParseResult;
};

type ValidationSchema = {
  body?: ValidationSchemaLike;
  query?: ValidationSchemaLike;
  params?: ValidationSchemaLike;
  files?: ValidationSchemaLike;
};

type RequestWithOptionalFiles = Request & { files?: unknown };

const formatValidationMessage = (issues: ValidationIssue[]): string => {
  if (issues.length === 0) return 'Invalid request';
  const issue = issues[0];
  const path = issue.path && issue.path.length > 0 ? issue.path.map(String).join('.') : 'request';
  return `${path}: ${issue.message}`;
};

const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const requestWithFiles = req as RequestWithOptionalFiles;
    const validationTargets: Array<['body' | 'query' | 'params' | 'files', unknown, ValidationSchemaLike | undefined]> = [
      ['body', req.body, schema.body],
      ['query', req.query, schema.query],
      ['params', req.params, schema.params],
      ['files', requestWithFiles.files, schema.files],
    ];

    for (const [key, value, zodSchema] of validationTargets) {
      if (!zodSchema) continue;

      const parsed = zodSchema.safeParse(value);
      if (!parsed.success) {
        next(
          badRequestError(
            formatValidationMessage(parsed.error.issues.map((issue: ValidationIssue) => ({ path: [key, ...(issue.path ?? [])], message: issue.message }))),
            'VALIDATION_ERROR'
          )
        );
        return;
      }

      (req as any)[key] = parsed.data;
    }

    next();
  };
};

export { validateRequest };