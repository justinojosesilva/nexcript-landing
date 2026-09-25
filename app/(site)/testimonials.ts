/**
 * Depoimentos de clientes. A seção só aparece na landing quando houver pelo
 * menos um item: use apenas depoimentos reais, com autorização do cliente.
 *
 * Exemplo:
 * {
 *   quote: "O site organizou nossos serviços e os pedidos de orçamento chegam mais completos.",
 *   name: "Nome Sobrenome",
 *   role: "Sócio",
 *   company: "G.F.R. Serviços e Instalações Elétricas",
 * }
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [];
