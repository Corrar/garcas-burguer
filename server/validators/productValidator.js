import { z } from 'zod';

// Aqui definimos as regras exatas de como um Produto deve ser
export const productSchema = z.object({
  name: z.string().min(2, "O nome do produto tem de ter pelo menos 2 letras"),
  description: z.string().optional(),
  
  // O preço TEM de ser um número e tem de ser maior que zero!
  price: z.number().positive("O preço tem de ser maior que zero"),
  
  category: z.string().min(1, "A categoria é obrigatória"),
  
  // A imagem é opcional, mas se for enviada, aceitamos um texto vazio ou um URL válido
  image: z.string().optional().or(z.literal('')),
  
  popular: z.boolean().optional(),
  
  // Customizations tem de ser uma lista (array)
  customizations: z.array(z.any()).optional() 
});
