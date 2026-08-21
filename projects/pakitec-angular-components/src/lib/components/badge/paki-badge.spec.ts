import { TestBed } from '@angular/core/testing';
import { PakiBadge } from './paki-badge';
describe('PakiBadge', () => {
  it('defaults to neutral', async () => {
    await TestBed.configureTestingModule({ imports: [PakiBadge] }).compileComponents();
    const fixture = TestBed.createComponent(PakiBadge);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('paki-badge--neutral');
  });
});
