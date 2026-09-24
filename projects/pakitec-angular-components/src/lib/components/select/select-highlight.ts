export interface PakiHighlightPart {
  text: string;
  match: boolean;
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('pt-BR');
}

/**
 * Divide `label` em trechos marcando a primeira ocorrência de `term`, sem diferenciar
 * acentos nem maiúsculas ("sao" destaca "São"). Preserva o texto original do rótulo.
 * Sem termo ou sem ocorrência, devolve o rótulo inteiro como um único trecho não marcado.
 */
export function highlightParts(label: string, term: string): PakiHighlightPart[] {
  const query = fold(term.trim());
  if (!query) return [{ text: label, match: false }];

  // Monta o texto "dobrado" guardando, para cada caractere dobrado, o índice no rótulo original.
  let folded = '';
  const origin: number[] = [];
  for (let i = 0; i < label.length; i++) {
    for (const ch of fold(label[i]!)) {
      folded += ch;
      origin.push(i);
    }
  }

  const at = folded.indexOf(query);
  if (at < 0) return [{ text: label, match: false }];

  const start = origin[at]!;
  const end = origin[at + query.length - 1]! + 1;
  return [
    { text: label.slice(0, start), match: false },
    { text: label.slice(start, end), match: true },
    { text: label.slice(end), match: false },
  ].filter((part) => part.text.length > 0);
}
