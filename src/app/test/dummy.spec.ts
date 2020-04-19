import {TestBed} from "@angular/core/testing";

describe("dummy ", () => {
  it("dummy test 1+1", () => {
    const hello = 1;
    expect(hello * 2).toEqual(2);
  });

  it("dummy test 1*1", () => {
    const hello = 1;
    expect(hello * hello).toEqual(1);
  });

  // it("dummy test 2+2", () => {
  //   const hello = 2;
  //   expect(hello * 2).toEqual(4);
  // });

  // it("dummy test 2*2", () => {
  //   const hello = 2;
  //   expect(hello * hello).toEqual(4);
  // });
  //
  // it("dummy test 1*2", () => {
  //   const hello = 2;
  //   expect(1 * hello).toEqual(2);
  // });
  //
  // it("dummy test 1*3", () => {
  //   const hello = 3;
  //   expect(1 * hello).toEqual(3);
  // });
  // it("dummy test 1*4", () => {
  //   const hello = 4;
  //   expect(1 * hello).toEqual(4);
  // });
  // it("dummy test 1*5", () => {
  //   const hello = 5;
  //   expect(1 * hello).toEqual(5);
  // });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
