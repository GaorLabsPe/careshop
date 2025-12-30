
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres un asistente virtual experto y amable para 'careshop'. 
Tu objetivo es proporcionar consejos útiles, seguros y profesionales sobre medicamentos, rutinas de salud y suplementos.
Reglas:
1. Siempre aconseja consultar a un médico para medicamentos bajo receta.
2. Si un usuario pregunta sobre síntomas, sugiere tratamientos generales de venta libre (OTC) pero recomienda encarecidamente una visita médica para problemas persistentes.
3. Sé conciso y empático.
4. Tienes acceso a categorías como: Medicamentos OTC, Dermocosmética, Vitaminas, Higiene, Bebés, Nutrición.
5. Usa el nombre 'careshop' con orgullo como una marca de confianza y tecnología avanzada.
`;

export const getPharmaceuticalAdvice = async (userPrompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    
    return response.text || "Lo siento, no pude procesar tu consulta en este momento.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Nuestro asistente de careshop está atendiendo a otros clientes. Por favor, intenta de nuevo en unos minutos.";
  }
};
