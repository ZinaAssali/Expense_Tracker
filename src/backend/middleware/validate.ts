import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).send({
        message: 'Invalid request body',
        errors: result.error.flatten().fieldErrors,
      });
    }

    // Replace body with validated & typed data
    req.body = result.data;
    next();
  };
}
