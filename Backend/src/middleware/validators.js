const { body, param, query, validationResult } = require('express-validator');
const { logValidationError } = require('../utils/logger');

// Middleware para processar resultados de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logValidationError(errors.array(), req.originalUrl);
    return res.status(400).json({
      success: false,
      error: {
        message: 'Dados de entrada inválidos',
        details: errors.array()
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Validações para leads de pacientes
const validatePatientLead = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter formato válido')
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),
  
  body('telefone')
    .trim()
    .matches(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/)
    .withMessage('Telefone deve ter formato válido (ex: (11) 99999-9999)'),
  
  body('cep')
    .trim()
    .matches(/^\d{5}-?\d{3}$|^[a-zA-ZÀ-ÿ\s,]+$/)
    .withMessage('CEP deve ter formato válido (12345-678) ou nome da cidade'),
  
  body('consentimento')
    .isBoolean()
    .withMessage('Consentimento deve ser verdadeiro ou falso')
    .custom((value) => {
      if (!value) {
        throw new Error('Consentimento é obrigatório');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validações para parceria com ortodontistas - Passo 1
const validateOrthodontistPartnershipStep1 = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s.]+$/)
    .withMessage('Nome deve conter apenas letras, espaços e pontos'),
  
  body('clinica')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome da clínica deve ter entre 2 e 255 caracteres'),
  
  body('cro')
    .trim()
    .matches(/^CRO-[A-Z]{2}\s?\d{4,6}$/)
    .withMessage('CRO deve ter formato válido (ex: CRO-SP 12345)'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter formato válido')
    .isLength({ max: 255 })
    .withMessage('Email muito longo'),
  
  body('telefone')
    .trim()
    .matches(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/)
    .withMessage('Telefone deve ter formato válido'),
  
  handleValidationErrors
];

// Validações para parceria com ortodontistas - Dados completos
const validateOrthodontistPartnership = [
  ...validateOrthodontistPartnershipStep1.slice(0, -1), // Remove handleValidationErrors do step1
  
  body('consultórios')
    .isIn(['1', '2-3', '4-5', '6+'])
    .withMessage('Número de consultórios deve ser uma opção válida'),
  
  body('scanner')
    .isIn(['sim', 'nao'])
    .withMessage('Informação sobre scanner deve ser sim ou não'),
  
  body('scannerMarca')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Marca do scanner deve ter no máximo 100 caracteres'),
  
  body('casosmes')
    .isIn(['1-5', '6-10', '11-20', '21+'])
    .withMessage('Número de casos por mês deve ser uma opção válida'),
  
  body('interesse')
    .isIn(['atma-aligner', 'atma-labs', 'ambos'])
    .withMessage('Tipo de interesse deve ser uma opção válida'),
  
  body('mensagem')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Mensagem deve ter no máximo 2000 caracteres'),
  
  handleValidationErrors
];

// Validações para busca de ortodontistas
const validateOrthodontistSearch = [
  query('cep')
    .optional()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve ter formato válido'),
  
  query('cidade')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  query('estado')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),
  
  query('distancia')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Distância deve ser um número entre 1 e 200 km'),
  
  handleValidationErrors
];

// Validações para parâmetros de ID
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID deve ser um número inteiro positivo'),
  
  handleValidationErrors
];

// Validações para atualização de status
const validateStatusUpdate = [
  body('status')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Status é obrigatório'),
  
  body('observacoes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres'),
  
  handleValidationErrors
];

// Validações para configurações do sistema
const validateSystemSetting = [
  body('setting_key')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Chave de configuração deve ter entre 1 e 100 caracteres')
    .matches(/^[a-z_]+$/)
    .withMessage('Chave deve conter apenas letras minúsculas e underscores'),
  
  body('setting_value')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Valor da configuração é obrigatório'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres'),
  
  handleValidationErrors
];

module.exports = {
  validatePatientLead,
  validateOrthodontistPartnershipStep1,
  validateOrthodontistPartnership,
  validateOrthodontistSearch,
  validateId,
  validateStatusUpdate,
  validateSystemSetting,
  handleValidationErrors
};