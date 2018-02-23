import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteMultiSelectComponent } from './autocomplete-multi-select.component';

describe('AutocompleteMultiSelectComponent', () => {
  let component: AutocompleteMultiSelectComponent;
  let fixture: ComponentFixture<AutocompleteMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
