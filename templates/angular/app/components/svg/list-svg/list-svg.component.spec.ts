import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSvgComponent } from './list-svg.component';

describe('ListSvgComponent', () => {
  let component: ListSvgComponent;
  let fixture: ComponentFixture<ListSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSvgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
