import {formatJsonApiData, mergeFunction} from "./commonHelper";
import mergeWith from "lodash/mergeWith";

describe("helperMethods.js", () => {
  it('tests formatJsonApiData to handle fast json api for single resource', () => {
    // let sampleResponse = {org: {data: {id: 90, type: "org", attributes: {id: 90, name: "Hello"}}}}
    let sampleResponse = {data: {id: 90, type: "org", attributes: {id: 90, name: "Hello"}}}

    expect(formatJsonApiData(sampleResponse)).toEqual({
      id: 90, name: "Hello" 
    });
  });

    it("tests formatJsonApiData to handle response without fast json api", () => {
      // let sampleResponse = {org: {data: {id: 90, type: "org", attributes: {id: 90, name: "Hello"}}}}
      let sampleResponse = {
        data: {  id: 90, name: "Hello" } 
      };

      expect(formatJsonApiData(sampleResponse)).toEqual({
        id: 90,
        name: "Hello"
      });
    });

  it("tests formatJsonApiData to handle fast json api for multiple resource", () => {
    // let sampleResponse = {orgs: {data: [{id: 90, type: "org", attributes: {id: 90, name: "Hello"}}, ]}}
    let sampleResponse = {
      data: [{ id: 90, type: "org", attributes: { id: 90, name: "Hello" } }]
    };

    expect(formatJsonApiData(sampleResponse)).toEqual([
      { id: 90, name: "Hello" } 
    ]);
  });


  it("should test mergeWith to merge existing data with formUpdate data", () => {
    
    let source1 = {
      // id: 1,
      name: "Hello",
      object: {
        kind: "1",
        override: "1"
      },
      array: [
        {
          arrayItem1: "arrayItem1",
        }
      ],
      arrayNo: [2,3]
    };
    let source2 = {
      id: 1,
      name: "Hello 1",
      object: {
        kind: "2",
        override: "2"
      },
      array: [
        {
          id: 1, 
          arrayItem1: "arrayItem2"
        },
        {
          id: 2, 
          arrayItem1: "arrayItem2"
        }
      ],
      arrayNo: [1]
    };
    const finalMerged =  mergeWith({}, source2, source1, mergeFunction);
    console.log( "finalMerged", finalMerged );
    expect(finalMerged).toEqual({
      id: 1,
      name: "Hello",
      object: {
        kind: "1",
        override: "1"
      },
      array: [
        {
          // id: 1,
          arrayItem1: "arrayItem1",
        }
      ],
      arrayNo: [2,3]
    });
  });
  
})