import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashbordComponent } from './employee-dashbord.component';

describe('EmployeeDashbordComponent', () => {
  let component: EmployeeDashbordComponent;
  let fixture: ComponentFixture<EmployeeDashbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDashbordComponent]
    });
    fixture = TestBed.createComponent(EmployeeDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
