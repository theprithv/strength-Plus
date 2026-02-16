import { ZodError } from "zod";

/**
 * Zod validation middleware factory.
 * Validates req.body, req.params, and/or req.query against Zod schemas.
 *
 * @param {{ body?: ZodSchema, params?: ZodSchema, query?: ZodSchema }} schemas
 * @returns Express middleware
 *
 * Usage:
 *   import { validate } from "../middlewares/validate.js";
 *   router.post("/", protect, validate({ body: createSchema }), handler);
 */
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      const parsed = schemas.query.parse(req.query);
      // req.query might be a getter-only property in some environments, so we mutate the object
      for (const key in req.query) {
        delete req.query[key];
      }
      Object.assign(req.query, parsed);
    }
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};
