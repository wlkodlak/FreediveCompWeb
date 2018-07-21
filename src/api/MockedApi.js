class MockedApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  postRaceSetup(raceId, raceSetup) {
    console.log("postRaceSetup(" + raceId + ")");
    console.log(raceSetup);
    return Promise.resolve(null);
  }

  getRaceSetup(raceId) {
    return Promise.resolve({
      "Race": {
        "RaceId": raceId,
        "Name": "MČR 2018",
        "Start": "2018-05-26",
        "End": "2018-05-28"
      },
      "StartingLanes": [
        {
          "StartingLaneId": "STA",
          "ShortName": "STA",
          "SubLanes": [
            {
              "StartingLaneId": "STA-A",
              "ShortName": "A"
            },
            {
              "StartingLaneId": "STA-B",
              "ShortName": "B"
            },
            {
              "StartingLaneId": "STA-C",
              "ShortName": "C"
            },
            {
              "StartingLaneId": "STA-D",
              "ShortName": "D"
            }
          ]
        },
        {
          "StartingLaneId": "DYN",
          "ShortName": "DYN",
          "SubLanes": [
            {
              "StartingLaneId": "DYN-A",
              "ShortName": "A"
            },
            {
              "StartingLaneId": "DYN-B",
              "ShortName": "B"
            }
          ]
        }
      ],
      "Disciplines": [
        {
          "DisciplineId": "STA-M",
          "ShortName": "STA",
          "LongName": "Static apnea - Men",
          "Rules": "AIDA-STA",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "STA-F",
          "ShortName": "STA",
          "LongName": "Static apnea - Women",
          "Rules": "AIDA-STA",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "DYN-M",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA-DYN",
          "AnnouncementsClosed": false
        },
        {
          "DisciplineId": "DYN-F",
          "ShortName": "DYN",
          "LongName": "Dynamic apnea - Men",
          "Rules": "AIDA-DYN",
          "AnnouncementsClosed": false
        }
      ],
      "ResultsLists": [
        {
          "ResultsListId": "Men",
          "Title": "Final Results - Men",
          "Columns": [
            {
              "Title": "STA",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "STA-M"
                }
              ]
            },
            {
              "Title": "DYN",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "DYN-M"
                }
              ]
            },
            {
              "Title": "Total",
              "IsFinal": true,
              "Components": [
                {
                  "DisciplineId": "STA-M"
                },
                {
                  "DisciplineId": "DYN-M"
                }
              ]
            }
          ]
        },
        {
          "ResultsListId": "Women",
          "Title": "Final Results - Women",
          "Columns": [
            {
              "Title": "STA",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "STA-F"
                }
              ]
            },
            {
              "Title": "DYN",
              "IsFinal": false,
              "Components": [
                {
                  "DisciplineId": "DYN-F"
                }
              ]
            },
            {
              "Title": "Total",
              "IsFinal": true,
              "Components": [
                {
                  "DisciplineId": "STA-F"
                },
                {
                  "DisciplineId": "DYN-F"
                }
              ]
            }
          ]
        }
      ]
    });
  }

  getAuthJudges(raceId) {
    return Promise.resolve([
      {
        "JudgeId": "admin",
        "JudgeName": "Master Geralt",
        "DeviceIds": ["lkacldskiuleknmcalkjdf"]
      },
      {
        "JudgeId": "milan",
        "JudgeName": "Milan Wilczak",
        "DeviceIds": ["983fkljh34k3ijnkjcbkh", "n4378cnbas65kjdkjhbcyde"]
      }
    ]);
  }

  postAuthAuthorize(raceId, authorizeRequest) {
    console.log("postAuthAuthorize(" + raceId + ")");
    console.log(authorizeRequest);
    return Promise.resolve({
      "JudgeId": authorizeRequest["JudgeId"],
      "JudgeName": authorizeRequest["JudgeName"],
      "DeviceIds": ["tesjckiyekj48wncu4"]
    });

  }
}

export default MockedApi;
