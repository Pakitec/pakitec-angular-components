import { highlightParts } from './select-highlight';

describe('highlightParts', () => {
  it('marca o trecho sem diferenciar acento nem maiúsculas, preservando o texto original', () => {
    expect(highlightParts('Vinhático - Espírito Santo', 'vinh')).toEqual([
      { text: 'Vinh', match: true },
      { text: 'ático - Espírito Santo', match: false },
    ]);
    expect(highlightParts('São Paulo', 'sao')).toEqual([
      { text: 'São', match: true },
      { text: ' Paulo', match: false },
    ]);
    expect(highlightParts('Pássaro', 'ASSA')).toEqual([
      { text: 'P', match: false },
      { text: 'ássa', match: true },
      { text: 'ro', match: false },
    ]);
  });

  it('devolve o rótulo inteiro quando não há termo ou ocorrência', () => {
    expect(highlightParts('Gato', '')).toEqual([{ text: 'Gato', match: false }]);
    expect(highlightParts('Gato', '   ')).toEqual([{ text: 'Gato', match: false }]);
    expect(highlightParts('Gato', 'xyz')).toEqual([{ text: 'Gato', match: false }]);
  });
});
