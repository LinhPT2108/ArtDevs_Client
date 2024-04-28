const sightengineAPI = "https://api.sightengine.com";

/*
 mail:{
    tranchinguyen14803 :{ // use full 28/4
      api_user: 1522419772,
      api_secret: bkpfdSon2WrDsBGbfAGzb4mDF9Tm8V77
    },
    tranchingyen.c2bt:{  // use full 28/4
      api_user: 916785234,
      api_secret: 2zUNA5omv3txYKwtuHJSYxSMuDTQEmLF
    }
     nguyentcpc04750:{  
      api_user: 1063528122,
      api_secret: aCysiY8R3kiMzMwRTYSoEd54paFPh97D
    }
 } 
*/
export const analyzeImage = async (imageURL: string) => {
  try {
    console.log(imageURL);
    const models =
      "nudity-2.0,wad,offensive,text-content,gore,tobacco,money,gambling";
    const response = await fetch(
      `${sightengineAPI}/1.0/check.json?models=${models}&url=${imageURL}&api_user=1063528122&api_secret=aCysiY8R3kiMzMwRTYSoEd54paFPh97D`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

type JsonObject = { [key: string]: any };

export function findMaxValue(jsonObject: JsonObject): {
  property: string;
  value: number;
} {
  let maxValue: number | undefined = undefined;
  let maxProperty: string | undefined = undefined;

  for (const key in jsonObject) {
    
    if (key === "request"|| key === "none"|| key === "context"|| key === "suggestive_classes") continue;

    const value = jsonObject[key];

    if (typeof value === "object") {
      const nestedMaxValue = findMaxValue(value);
      if (nestedMaxValue.value !== undefined && nestedMaxValue.value > (maxValue || 0)) {
        maxValue = nestedMaxValue.value;
        maxProperty = `${key}.${nestedMaxValue.property}`;
      }
    } else if (typeof value === "number") {
      if (maxValue === undefined || value > maxValue) {
        maxValue = value;
        maxProperty = key;
      }
    }
  }

  return { property: maxProperty!, value: maxValue! };
}
