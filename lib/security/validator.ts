import { z } from 'zod';

// Basic XSS sanitization
export function sanitizeText(text: string): string {
  if (!text) return text;
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function isSuspiciousInput(text: string): boolean {
  if (!text) return false;
  
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /SELECT.*FROM/gi,
    /UNION.*SELECT/gi,
    /DROP\s+TABLE/gi,
    /<iframe/gi,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(text));
}

// Zod schemas for common validations
export const schemas = {
  id: z.string().uuid(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
};
