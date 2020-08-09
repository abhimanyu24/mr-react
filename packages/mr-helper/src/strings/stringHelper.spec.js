import {pluralize, camelCase, underscore, upperCase, lowerCase, unCamelCase, pascalCase } from "./stringHelper";
// import * as from "./stringHelper";

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
    expect(
      pluralize("criterium")
    ).toEqual("criteria");
    expect(
      pluralize("criteria", true)
    ).toEqual("criterium");

    // expect(
    //   validator.isValid("key", "hellogmail.com", "required|email")
    // ).toEqual(false);
  });
  it('uppercases string', () => {
    expect(upperCase("user_Response")).toEqual("USER_RESPONSE");
  });
  it('pascalcases string', () => {
    expect(pascalCase("user_response")).toEqual("UserResponse");
  });
  it('lowercases string', () => {
    expect(lowerCase("USER_RESPONSE")).toEqual("user_response");
  });

  it('underscores string', () => {
    expect(underscore("userResponse")).toMatchSnapshot("user_response");
  });
  it('camelcases string', () => {
    expect(camelCase("user_response")).toEqual("userResponse");
    expect(camelCase("user response")).toEqual("userResponse");
    // console.log( "unCamelCase('userResponse')", unCamelCase('userResponse') );
    // console.log( "camelCase('user_response')", camelCase('user_response') );
    // expect(underscore(unCamelCase("userResponse"))).toEqual("user_response")
  });
  it('unCamelcases string', () => {
    expect(unCamelCase("user_response")).toEqual("user_response");
    expect(unCamelCase("userResponse")).toEqual("user response");
  });
  
});