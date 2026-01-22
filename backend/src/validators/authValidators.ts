// backend/src/validators/authValidators.ts
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])'))
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo (@$!%*?&)',
      'any.required': 'La contraseña es requerida'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'any.required': 'La contraseña es requerida'
    })
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  
  req.body = value;
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  
  req.body = value;
  next();
};