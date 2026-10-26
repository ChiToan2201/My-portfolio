import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {App} from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create the portfolio app for Danh Nguyễn Chí Toàn', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.profile().fullName).toBe('Danh Nguyễn Chí Toàn');
  });
});
