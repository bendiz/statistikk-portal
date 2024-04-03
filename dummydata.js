
// POST til https://data.ssb.no/api/v0/no/table/11342/

{
  "query": [
    {
      "code": "Region",
      "selection": {
        "filter": "vs:Kommune",
        "values": ["3330"]
      }
    },
    {
      "code": "ContentsCode",
      "selection": {
        "filter": "item",
        "values": ["Folkemengde", "ArealKm2"]
      }
    },
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": ["2024"]
      }
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}

