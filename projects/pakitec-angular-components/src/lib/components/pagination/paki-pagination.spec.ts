import { TestBed } from '@angular/core/testing';
import { PakiPagination } from './paki-pagination';

describe('PakiPagination', () => {
  it('emits the next page', async () => {
    await TestBed.configureTestingModule({ imports: [PakiPagination] }).compileComponents();
    const fixture = TestBed.createComponent(PakiPagination);
    fixture.componentRef.setInput('page', { number: 1, size: 10, totalElements: 18, totalPages: 2, first: true, last: false });
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));
    fixture.detectChanges();
    (fixture.nativeElement.querySelectorAll('button')[1] as HTMLButtonElement).click();
    expect(emitted).toEqual([2]);
  });
});
