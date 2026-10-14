import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

export type PakiDocumentKind = 'pdf' | 'image' | 'unsupported';

/** Tipos aceitos. Qualquer outro mostra a mensagem de formato não suportado. */
export function documentKind(mimeType: string): PakiDocumentKind {
  if (mimeType === 'application/pdf') return 'pdf';
  if (['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) return 'image';
  return 'unsupported';
}

/** Aceita somente URL HTTPS, `blob:` ou caminho do mesmo site. Bloqueia `javascript:`, `data:` e similares. */
export function isSafeDocumentUrl(url: string): boolean {
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'blob:';
  } catch {
    return false;
  }
}

/**
 * Visualizador do documento original. Usa o leitor nativo do navegador para PDF e `<img>` para imagens.
 * A URL deve ser autorizada pela API (por exemplo, URL pré-assinada de curta duração).
 */
@Component({
  selector: 'paki-document-viewer',
  templateUrl: './paki-document-viewer.html',
  styleUrl: './paki-document-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiDocumentViewer {
  private readonly sanitizer = inject(DomSanitizer);

  readonly src = input<string | null>(null);
  readonly mimeType = input.required<string>();
  readonly fileName = input.required<string>();
  readonly loading = input(false);
  /** Emite quando o arquivo não carrega, por exemplo se a URL expirou. */
  readonly loadError = output<void>();

  protected readonly failed = signal(false);
  protected readonly kind = computed(() => documentKind(this.mimeType()));
  protected readonly safeUrl = computed(() => {
    const url = this.src();
    return url && isSafeDocumentUrl(url) ? url : null;
  });
  protected readonly frameUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.safeUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  protected onError(): void {
    this.failed.set(true);
    this.loadError.emit();
  }
}
