import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionEvaluateComponent } from './submission.evaluate.component';

describe('Submission.EvaluateComponent', () => {
  let component: SubmissionEvaluateComponent;
  let fixture: ComponentFixture<SubmissionEvaluateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionEvaluateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
