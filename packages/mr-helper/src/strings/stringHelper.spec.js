import {pluralize, underscore, } from "./stringHelper";

describe("stringHelper.js", () => {
  it("pluralizes string", () => {
    expect(
      pluralize("mouse")
    ).toEqual("mice");
    expect(
      pluralize("mice", true)
    ).toEqual("mouse");
    
    expect(
      pluralize("userResponse")
    ).toEqual("userResponses");

    // expect(
    //   validator.isValid("key", "hellogmail.com", "required|email")
    // ).toEqual(false);
  });
  it('underscores string', () => {
    // expect(app).toMatchSnapshot();
  });
  
});