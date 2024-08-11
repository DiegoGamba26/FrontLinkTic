import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadReservationComponent } from './read-reservation.component';

describe('ReadReservationComponent', () => {
  let component: ReadReservationComponent;
  let fixture: ComponentFixture<ReadReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
