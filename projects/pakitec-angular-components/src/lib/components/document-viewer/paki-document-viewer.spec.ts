import { TestBed } from '@angular/core/testing';
import { PakiDocumentViewer, documentKind, isSafeDocumentUrl } from './paki-document-viewer';

describe('helpers do visualizador', () => {
  it('classifica o tipo do arquivo', () => {
    expect(documentKind('application/pdf')).toBe('pdf');
    expect(documentKind('image/png')).toBe('image');
    expect(documentKind('text/html')).toBe('unsupported');
  });
  it('aceita somente URLs seguras', () => {
    expect(isSafeDocumentUrl('https://bucket.s3.amazonaws.com/a.pdf?X-Amz-Signature=1')).toBe(true);
    expect(isSafeDocumentUrl('blob:https://app/abc')).toBe(true);
    expect(isSafeDocumentUrl('/api/v1/documents/1/file')).toBe(true);
    for (const url of ['javascript:alert(1)', 'data:text/html,<script>', '//evil.com/a.pdf', 'http://x.com/a.pdf', 'texto']) expect(isSafeDocumentUrl(url)).toBe(false);
  });
});

describe('PakiDocumentViewer', () => {
  async function render(inputs: Record<string, unknown>) {
    await TestBed.configureTestingModule({ imports: [PakiDocumentViewer] }).compileComponents();
    const fixture = TestBed.createComponent(PakiDocumentViewer);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('usa iframe para PDF e link seguro para o original', async () => {
    const el = await render({ src: 'https://x.test/a.pdf', mimeType: 'application/pdf', fileName: 'fatura.pdf' });
    expect(el.querySelector('iframe')?.getAttribute('title')).toBe('Documento: fatura.pdf');
    expect(el.querySelector('a')?.getAttribute('rel')).toContain('noopener');
  });
  it('usa img com texto alternativo para imagens', async () => {
    const el = await render({ src: 'https://x.test/a.png', mimeType: 'image/png', fileName: 'conta.png' });
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Documento: conta.png');
  });
  it('recusa URL insegura sem criar iframe', async () => {
    const el = await render({ src: 'javascript:alert(1)', mimeType: 'application/pdf', fileName: 'x.pdf' });
    expect(el.querySelector('iframe')).toBeNull();
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
  });
  it('informa formato não suportado', async () => {
    const el = await render({ src: 'https://x.test/a.docx', mimeType: 'application/msword', fileName: 'a.docx' });
    expect(el.textContent).toContain('não pode ser exibido');
  });
});
