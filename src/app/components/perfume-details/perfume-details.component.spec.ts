import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeDetailsComponent } from './perfume-details.component';

describe('PerfumeDetailsComponent', () => {
  let component: PerfumeDetailsComponent;
  let fixture: ComponentFixture<PerfumeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfumeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfumeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
