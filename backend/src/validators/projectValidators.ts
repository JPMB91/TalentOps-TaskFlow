// backend/src/validators/projectValidators.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const createProjectSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre del proyecto es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre del proyecto es requerido'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
  
  memberEmails: Joi.array()
    .items(Joi.string().email().messages({
      'string.email': 'Cada email debe ser válido'
    }))
    .optional()
    .messages({
      'array.base': 'memberEmails debe ser un array'
    })
});

const updateProjectSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

export const validateCreateProject = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createProjectSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  
  req.body = value;
  next();
};

export const validateUpdateProject = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = updateProjectSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  
  req.body = value;
  next();
};