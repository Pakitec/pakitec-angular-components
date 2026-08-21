import { TestBed } from '@angular/core/testing';
import { PakiCard } from './paki-card';
describe('PakiCard', () => {
  it('projects content', async () => {
    await TestBed.configureTestingModule({ imports: [PakiCard] }).compileComponents();
    const fixture = TestBed.createComponent(PakiCard);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
