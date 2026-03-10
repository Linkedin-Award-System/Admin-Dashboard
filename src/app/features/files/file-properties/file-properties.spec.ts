import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileProperties } from './file-properties';

describe('FileProperties', () => {
  let component: FileProperties;
  let fixture: ComponentFixture<FileProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileProperties],
    }).compileComponents();

    fixture = TestBed.createComponent(FileProperties);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
